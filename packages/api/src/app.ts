import cors from "cors";
import express from "express";
import serverless from "serverless-http";
import envParsed from "./envParsed.js";
import middlewares from "./middlewares.js";
import routes from "./routes/index.js";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

app.use(
  cors({
    origin: envParsed().CORS_ORIGIN,
  })
);

app.use(express.json());
app.use("/api", routes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

if (!envParsed().USE_SERVERLESS) {
  app.listen(envParsed().PORT, () => {
    console.log(`App Started at PORT=${envParsed().PORT}`);
  });
}

export const handler = serverless(app);
