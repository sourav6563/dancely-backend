/* eslint-disable @typescript-eslint/no-require-imports */
import { Router, Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "./env";
const router = Router();

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Video Streaming API",
      version: "1.0.0",
      description: "API documentation for Video Streaming API",
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
        },
      },
    },
    tags: [
      {
        name: "auth",
        description: "Authentication related endpoints",
      },
      {
        name: "user",
        description: "User related endpoints",
      },
      {
        name: "video",
        description: "Video related endpoints",
      },
      {
        name: "like",
        description: "Like related endpoints",
      },
      {
        name: "comment",
        description: "Comment related endpoints",
      },
      {
        name: "playlist",
        description: "Playlist related endpoints",
      },

      {
        name: "follower",
        description: "Follower related endpoints",
      },
      {
        name: "dashboard",
        description: "Dashboard related endpoints",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

router.get("/json", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;
