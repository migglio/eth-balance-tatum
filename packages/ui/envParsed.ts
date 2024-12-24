import { z } from "zod";

// NOTE: DO NOT destructure process.env

const env = {
  API_URL: import.meta.env.VITE_API_URL,
};

const envSchema = z.object({
  API_URL: z.string(),
});

const envParsed = () => envSchema.parse(env);

export default envParsed;
