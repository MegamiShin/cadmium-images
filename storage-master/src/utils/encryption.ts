import { createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from "crypto";

export function encrypt(data: Buffer, key: string): Buffer {
  const iv = randomBytes(16);
  const derivedKey = pbkdf2Sync(key, "", 1000, 32, "sha3-512");

  const cipher = createCipheriv("aes-256-gcm", derivedKey, iv);
  let buf = cipher.update(data);

  buf = Buffer.concat([ buf, cipher.final() ]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([
    buf,
    iv,
    authTag
  ])
};

export function decrypt(data: Buffer, key: string): Buffer {
  const iv = data.slice(-32, -16);
  const authTag = data.slice(-16);
  const cipherData = data.slice(0, -32);
  const derivedKey = pbkdf2Sync(key, "", 1000, 32, "sha3-512");
  
  const decipher = createDecipheriv("aes-256-gcm", derivedKey, iv);
  let buf = decipher.update(cipherData);
  decipher.setAuthTag(authTag);

  buf = Buffer.concat([ buf, decipher.final() ]);
  return buf;
}