import { config } from "dotenv"; config();
import { client } from "@cadmium-images/rpc";

import fastify from "fastify";
import multipart from "fastify-multipart";
import { generate } from "randomstring";
import { extname } from "path";

const app = fastify(); 
const storage = new client(process.env.STORAGE_URL!, process.env.STORAGE_TOKEN);
const core = new client(process.env.CORE_URL!, process.env.CORE_TOKEN);

app.register(multipart);

app.post("/upload", async (req, res) => {
  const data = await req.file();
  const buf = await data.toBuffer();

  const key: any = data.fields.key;
  const password: any = data.fields.password;

  if (!key || !password || !password.value || !key.value) return res.status(400).send({
    error: "bad fields"
  })


  if (!data.mimetype.startsWith("image")) return res.status(400).send({
    error: "not image type"
  })

  const authRes = await core.call("core.users.auth", { 
    accessKey: key.value
  });

  if (!authRes!.auth) return res.status(401).send({
    error: "invaild key"
  });

  const fileName = generate({
    length: 8,
    charset: "alphanumeric"
  }) + extname(data.filename);

  await storage.call("storage.upload", {
    buffer: buf,
    password: password.value,
    type: data.mimetype,
    name: fileName,
    id: authRes!.id
  });

  res.status(201).send({
    url: process.env.LOADER_URL + fileName
  })
});

app.listen(process.env.PORT!);