import { server } from "@cadmium-images/rpc";
import { SerializerObject, Response } from "../types";
import UserHelper from "../rpc-helpers/User";
import randomString from "../utils/randomString";
import discordUser from "../rpc-helpers/discordUser";

import prisma from "../prisma";

async function getUser(data: SerializerObject, res: Response) {
  const user = await UserHelper(data, res);
  if (!user) return;
  let userData = user;
  (userData as any).createdOn = user.createdOn.toISOString();

  res.write({
    success: true,
    ...userData as any
  });
};

async function createUser(data: SerializerObject, res: Response) {
  if (!data.hasOwnProperty("code")) return res.write({
    success: false,
    error: "invite is missing"
  });

  const invite = await prisma.invite.findUnique({
    where: { code: data.code as string }
  });

  if (!invite || invite.used) return res.write({
    success: false,
    error: "invaild invite"
  });
  const rpcData: any = data;
  
  if (await prisma.user.findFirst({ 
    where: { discordId: rpcData.discordId }
  })) return res.write({
    success: false,
    error: "discord user is already registered"
  });

  const user = await prisma.user.create({
    data: {
      accessKey: randomString(16),
      discordId: rpcData.discordId
    }
  });

  await prisma.invite.update({
    where: { code: invite.code },
    data: { used: true }
  });

  res.write({
    success: true,
    id: user.id
  });
}

async function authUser(data: SerializerObject, res: Response) {
  const user = await prisma.user.findFirst({
    where: {
      accessKey: (data as any).accessKey
    }
  });

  if (!user || !user.accessible) return res.write({
    auth: false
  });

  res.write({
    auth: true,
    id: user.id
  });
}

async function getDiscordUser(data: SerializerObject, res: Response) {
  const user = await discordUser(data, res);
  if (!user) return;
  let userData = user;
  (userData as any).createdOn = user.createdOn.toISOString();

  res.write({
    success: true,
    ...userData as any
  });
};

async function toggleUser(data: SerializerObject, res: Response) {
  const user = await UserHelper(data, res);
  if (!user) return;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      accessible: data.flag as any
    }
  });

  res.write({
    success: true
  })
}

export default (rpc: server) => {
  rpc.register("core.users.get", getUser);
  rpc.register("core.users.discord.get", getDiscordUser);
  rpc.register("core.users.create", createUser);
  rpc.register("core.users.auth", authUser);
  rpc.register("core.users.toggle", toggleUser);
}