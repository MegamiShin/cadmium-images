import { randomBytes } from "crypto";

export default (len: number = 8) => {
  return randomBytes(len).toString("hex")
};