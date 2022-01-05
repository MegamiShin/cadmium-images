// response wrapper 
import { ServerResponse } from "http";
import { encode } from "@msgpack/msgpack"

export default class Response { 
  res: ServerResponse

  constructor(res: ServerResponse) {
    this.res = res;
  }

  write(data: any) {
    this.res.write(encode(data));
    this.res.end();
  }
}