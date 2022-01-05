import hash from "../utils/hash";
import { encrypt, decrypt } from "../utils/encryption";
import { readFile, writeFile, unlink } from "fs/promises";
import level, { LevelDB } from "level";
import { randomBytes } from "crypto";
import hmac from "../utils/hmac";
import { promisify } from "util";
import { brotliCompress, brotliDecompress } from "zlib";

const compress = promisify(brotliCompress);
const decompress = promisify(brotliDecompress);

export default class fs {
  db: LevelDB

  constructor() {
    this.db = level("db");
  }

  async read(file: string): Promise< [ Buffer, string ] | undefined> {
    try {
      let data = await this.db.get(hash(Buffer.from(file)));
  
      if (data) {
        data = JSON.parse(data);
        const fileData = await readFile("./files/" + data.pathName);
        const decompressedData = await decompress(fileData);

        return [ decrypt(decompressedData, file), data.type ];
      }
    } catch {
      return undefined;
    }
    
  }

  async write(file: Buffer, password: string, name: string, type: string, id: string) {
    const fileNameHash = hash(Buffer.from(name));
    const data = encrypt(file, name);
    const pathName = randomBytes(8).toString("hex");
    const dbValue = {
      pathName,
      password: hash(Buffer.from(password)),
      key: encrypt(Buffer.from(name), password).toString("base64"),
      type,
      identifier: hmac(Buffer.from(id), password)
    };
    const buf = await compress(data);
    await this.db.put(fileNameHash, JSON.stringify(dbValue));

    await writeFile("./files/" + pathName, buf);
  }

  async fetch(name: string) {
    const dbKey = hash(Buffer.from(name));

    try {
      let data = await this.db.get(dbKey);
      return {
        dbKey,
        ...JSON.parse(data)
      };
    } catch {
      return undefined;
    }
  }

  async delete(name: string): Promise<boolean> {
    const dbKey = hash(Buffer.from(name));

    try {
      const data = await this.db.get(dbKey);
      const parsedData = JSON.parse(data);

      await this.db.del(dbKey);
      await unlink("./files/" + parsedData.pathName);
      return true;
    } catch {
      return false;
    }
  }
}