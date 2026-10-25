import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { requestTimer } from "./middleware/requestTimer.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(requestTimer);

app.use(routes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
