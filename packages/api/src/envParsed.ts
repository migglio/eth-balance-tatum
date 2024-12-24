import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

// NOTE: DO NOT destructure process.env

const env = {
  PORT: process.env.PORT,
  USE_SERVERLESS: process.env.USE_SERVERLESS,
  NODE_ENV: process.env.NODE_ENV,
  API_KEY: process.env.API_KEY,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};

const envSchema = z.object({
  USE_SERVERLESS: z
    .string()
    .transform((value) => value.toLowerCase() === "true")
    .default("false"),
  NODE_ENV: z
    .enum(["test", "development", "production"])
    .default("development"),
  PORT: z.string().default("5000"),
  API_KEY: z.string(),
  CORS_ORIGIN: z.string().default("*"),
});

const envParsed = () => envSchema.parse(env);

export default envParsed;
