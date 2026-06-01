import { default as app, connectAndSeed } from "../artifacts/api-server/dist/app.mjs";

let ready = false;
const boot = connectAndSeed().then(() => { ready = true; });

export default async function handler(req, res) {
  if (!ready) await boot;
  app(req, res);
}
