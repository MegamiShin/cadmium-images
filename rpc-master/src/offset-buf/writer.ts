const leb128 = require("leb128");

export default class writer {
  buffer: Buffer[];

  constructor() {
    this.buffer = [];
  };

  writeByte(byte: number) {
    this.buffer.push(Buffer.from([ byte ]));
  };

  writeInt(int: number) {
    const encodedInt: Buffer = leb128.unsigned.encode(int);
    this.writeByte(encodedInt.length);

    this.buffer.push(encodedInt);
  };

  writeBool(bool: boolean) {
    this.writeByte(Number(bool));
  };

  writeString(str: string) {
    this.buffer.push(Buffer.from(str));
  };

  writeBuffer(buf: Buffer) {
    this.buffer.push(buf);
  };

  concat(): Buffer {
    return Buffer.concat(this.buffer);
  }
};