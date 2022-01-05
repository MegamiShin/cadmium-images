import { Response, SerializerObject } from "../types"
import { server } from "@cadmium-images/rpc"
import prisma from "../prisma";
import { v4 } from "uuid";

async function createInvite(data: SerializerObject, res: Response) {
  const invite = await prisma.invite.create({
    data: { code: v4() }
  });

  res.write({
    success: true,
    invite: invite.code
  });
};

export default (rpc: server) => {
  rpc.register("core.invites.create", createInvite);
}