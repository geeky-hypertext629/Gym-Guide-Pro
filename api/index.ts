import type { VercelRequest, VercelResponse } from "@vercel/node";
import app, { connectAndSeed } from "../artifacts/api-server/src/app.js";

let ready = false;
const boot = connectAndSeed().then(() => { ready = true; });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!ready) await boot;
  (app as any)(req, res);
}
