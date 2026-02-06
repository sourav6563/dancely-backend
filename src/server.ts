import { logger } from "./utils/logger";

import { env } from "./env";
import { app } from "./app";
const server = app.listen(env.PORT, () => {
  logger.info(`server running on port : ${env.PORT}`);
});

// Increase timeout for large file uploads (10 minutes)
server.timeout = 600000;
server.keepAliveTimeout = 620000;
server.headersTimeout = 660000;

server.on("error", (error) => {
  logger.error(error);
  process.exit(1);
});
