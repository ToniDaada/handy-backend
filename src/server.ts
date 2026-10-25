import "dotenv/config";

import app from "./config.js";

const portValue = process.env.PORT;

if (!portValue) {
  throw new Error("PORT environment variable is required");
}

const port = Number(portValue);

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
