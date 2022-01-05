import { server } from "@cadmium-images/rpc";
import fsNode from "../fsNode";

const rpcServer = new server(process.env.RPC_TOKEN);

rpcServer.register("storage.upload", async (data, res) => {
  const { password, name, buffer, type, id } = data;
  if (!buffer || !name || !password || !type || !id) return res.write({
    success: false,
    error: "part is missing"
  });

  await fsNode.write(buffer as Buffer, password as string, name as string, type as string, id as string)!;

  res.write({
    success: true,
    message: "uploaded"
  });
});

rpcServer.register("storage.delete", async (data, res) => {
  const { name } = data;
  if (!name) return res.write({
    success: false,
    error: "part is missing"
  });

  const deleted = await fsNode.delete(name as string);

  res.write({
    deleted
  });
});

rpcServer.register("storage.fetch", async (data, res) => {
  const { name } = data;
  if (!name) return res.write({
    success: false,
    error: "part is missing"
  });

  const fsData = await fsNode.fetch(name as string);

  res.write(fsData);
})

rpcServer.start(process.env.RPC_PORT as any); // fuck off ...