import type { IncomingMessage, ServerResponse } from "node:http";
import app, { connectAndSeed } from "../artifacts/api-server/src/app.js";

let ready = false;
const boot = connectAndSeed().then(() => { ready = true; });

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!ready) await boot;
  (app as any)(req, res);
}
