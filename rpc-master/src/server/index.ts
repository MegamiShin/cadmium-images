import { createServer, Server, IncomingMessage, ServerResponse } from "http";
import reader from "../offset-buf/reader";
import Response from "./response";
import { encode, decode } from "@msgpack/msgpack";

const serialize = (data: any) => Buffer.from(encode(data))
const deserialize = (data: Buffer) => decode(data)

export default class rpcServer {
  server?: Server
  functions: Map<string, (data: any, res: Response) => any>
  authToken?: string;

  constructor(authToken?: string) {
    this.functions = new Map();
    this.authToken = authToken;
  }

  register(name: string, func: (data: any, res: Response) => any) {
    this.functions.set(name, func);
  }

  private serve(req: IncomingMessage, res: ServerResponse) {
    const { authToken } = this;
    const chunks: any[] = [];

    req.on("data", chunk => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      if (req.url === "/rpc" && req.method === "GET") return res.end();

      if (req.url !== "/call" || req.method !== "POST" || req.headers["content-type"] !== "binary/rpc") return res
        .writeHead(400)
        .end();
      
      const buf = Buffer.concat(chunks);
      const readingStream = new reader(buf);
      const type = readingStream.readString(readingStream.readInt());
      const data = readingStream.readBuffer(readingStream.readInt());

      const requestFunction = this.functions.get(type);

      if (!requestFunction) {
        res.write(serialize({
          error: "invaild function",
          internal: true
        }));
        return res.end();
      };

      if (authToken && req.headers["authorization"] !== authToken) {
        res.write(serialize({
          error: "unauthorized",
          internal: true
        }));
        return res.end();
      };

      const dataObj = deserialize(data);
  
      if (!dataObj) return res.writeHead(400).end();
      const errorHandler = this.functions.get("internal.error");

      try {
        requestFunction(dataObj, new Response(res));
      } catch(err) {
        if (errorHandler) {
          errorHandler(dataObj, new Response(res));
        } else {
          res.write(serialize({
            error: (err as any).message,
            internal: true,
            serverError: true
          }));
          res.end();
        }
      }
    });
  };

  start(port: number) {
    const server = createServer(this.serve.bind(this));
    server.listen(port);
  };
}