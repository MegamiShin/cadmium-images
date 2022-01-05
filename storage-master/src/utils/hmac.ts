import { createHmac } from "crypto";

export default (data: Buffer, mac: string): string => {
  const hash = createHmac("sha3-512", mac);

  hash.update(data);
  return hash.digest("hex");
}