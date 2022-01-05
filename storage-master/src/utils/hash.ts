import { createHash } from "crypto";

export default (data: Buffer): string => {
  const hash = createHash("sha3-512");

  hash.update(data);
  return hash.digest("hex");
}