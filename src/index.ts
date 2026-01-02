import { logger } from "./utils/logger";
import { port } from "./config";
import { app } from "./app";
const server = app.listen(port, () => {
  logger.info(`server running on port : ${port}`);
});

server.on("error", (error) => {
  logger.error(error);
  process.exit(1);
});
