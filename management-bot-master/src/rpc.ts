import { client } from "@cadmium-images/rpc";

const core = new client(process.env.CORE_URL!, process.env.CORE_TOKEN!);

export default core;