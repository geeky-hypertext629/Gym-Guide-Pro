import app, { connectAndSeed } from "./app.js";
import { logger } from "./lib/logger.js";

const port = Number(process.env["PORT"] ?? 3000);

connectAndSeed()
  .then(() => {
    app.listen(port, (err?: Error) => {
      if (err) {
        logger.error({ err }, "Error listening on port");
        process.exit(1);
      }
      logger.info({ port }, "Server listening");
    });
  })
  .catch((err) => {
    logger.error({ err }, "Failed to connect to MongoDB");
    process.exit(1);
  });
