import { config } from "dotenv"; config();
import Client from "./client";

const client = new Client({
  token: process.env.TOKEN!,
  prefix: "!"
});

client.start();