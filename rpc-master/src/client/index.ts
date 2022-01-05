import { request } from "http"
import writer from "../offset-buf/writer";
import { encode, decode } from "@msgpack/msgpack";

export default class rpcClient {
  url: string
  authToken?: string;

  constructor(url: string, authToken?: string) {
    this.url = url;
    this.authToken = authToken;
  }

  
  check(url: string): Promise<boolean> {
    return new Promise(resolve => {
      const httpReq = request(url, (res) => {
        if (res.statusCode === 200) return resolve(true);
        resolve(false);
      });
      
      httpReq.end();
    });
  }

  call(name: string, data: any): Promise<any | undefined> {
    const { url, check, authToken } = this;
    const buf = new writer();
    const bufData = encode(data);

    buf.writeInt(name.length);
    buf.writeString(name);
    buf.writeInt(bufData.length);
    buf.writeBuffer(Buffer.from(bufData));
    const requestBuf = buf.concat();

    return new Promise(async (resolve, reject) => {
      if (!await check(url + "/rpc")) reject("not a rpc server");
      
      const options = { // copied the options object from the nodejs docs (mit licenced example btw)
        method: 'POST',
        headers: {
          'Content-Type': 'binary/rpc',
          'Content-Length': requestBuf.byteLength,
          "authorization": authToken ? authToken : ""
        }
      };

      const httpReq = request(url + "/call", options, (res) => {
        const chunks: any[] = [];
        res.on("data", chunk => {
          chunks.push(chunk)
        });

        res.on("end", () => {
          resolve(decode(Buffer.concat(chunks)));
        });
      });
      
      httpReq.write(requestBuf);
      httpReq.end();
    });
  }
}