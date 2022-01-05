const leb128 = require("leb128");

export default class reader { 
  buffer: Buffer
  pos: number = 0

  constructor(buffer: Buffer) {
    this.buffer = buffer;
  }

  readBytes(len: number): Buffer {
    const buffer = this.buffer.subarray(this.pos, this.pos + len);

    this.pos += len
    
    return buffer;
  }

  readByte(): number {
    return this.readBytes(1)[0];
  }

  readInt(): number {
    const length = this.readByte();
    const buffer = this.readBytes(length);

    return parseInt(leb128.unsigned.decode(buffer));
  }

  readBool(): boolean {
    return Boolean(this.readByte());
  }

  readBuffer(length: number): Buffer {
    return this.readBytes(length);
  }

  readString(length: number): string {
    return this.readBytes(length).toString();
  }
}