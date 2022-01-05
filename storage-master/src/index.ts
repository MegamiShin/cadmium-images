import { config } from "dotenv"; config();

import { createServer } from "http";
import './rpc-relay';
import fsNode from "./fsNode";
import discordBypassHtml from "./utils/discordBypassHtml";
const discordAgent = "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)";

const httpServer = createServer(async (req, res) => {
  const [ , name, raw ] = req.url!.split("/");
  
  const file = await fsNode.read(name);

  if (!file) {
    res.writeHead(404);
    res.write("404 not found");
    return res.end();
  }

  if (file[1].startsWith("image") && !raw && req.headers["user-agent"] === discordAgent && !process.env.DISABLE_SHOW_URL) {
    res.setHeader("Content-Type", "text/html")
    res.write(discordBypassHtml(process.env.IMAGE_URL! + name));
    return res.end();
  };

  res.setHeader("Content-Type", file[1]);
  res.write(file[0]);

  res.end();
});

httpServer.listen(process.env.PORT!);