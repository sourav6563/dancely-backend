import dotenv from "dotenv";
dotenv.config();

export const environment = process.env.NODE_ENV;
export const port = process.env.PORT || 8000;

export const db = {
  minPoolSize: parseInt(process.env.DB_MIN_POOL_SIZE ?? "5"),
  maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE ?? "10"),
  URI: process.env.MONGODB_URI as string,
};
