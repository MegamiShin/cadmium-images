import { Response, SerializerObject } from "../types";

import prisma from "../prisma";
import { User } from "@prisma/client";

export default async (data: SerializerObject, res: Response): Promise<User | undefined> => {
  const user = await prisma.user.findFirst({
    where: { id: data.id as string }
  });

  if (!user) {
    res.write({
      error: "user was not found"
    });
    return undefined;
  };

  return user;
}