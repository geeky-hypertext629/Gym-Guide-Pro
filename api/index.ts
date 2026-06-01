import app, { connectAndSeed } from "../artifacts/api-server/src/app.js";

let ready = false;
const boot = connectAndSeed().then(() => { ready = true; });

export default async function handler(req: any, res: any) {
  if (!ready) await boot;
  app(req, res);
}
