import { config } from "dotenv"; config();
import { server } from "@cadmium-images/rpc";
import User from "./rpc/User";
import Invite from "./rpc/Invite";

const rpc = new server(process.env.RPC_TOKEN!);
User(rpc);
Invite(rpc);

rpc.start(process.env.RPC_PORT as any);