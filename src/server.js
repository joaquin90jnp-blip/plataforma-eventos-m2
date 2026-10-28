import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import app from "./app.js";

try {
  await connectDB(env.MONGO_URL);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const server = app.listen(env.PORT, () => {
  console.log(`Servidor activo en http://localhost:${env.PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`El puerto ${env.PORT} ya está en uso.`);
  } else {
    console.error(error);
  }
  process.exit(1);
});

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} recibido, cerrando servidor...`);

  const forceExit = setTimeout(() => process.exit(1), 10_000);
  forceExit.unref();

  server.close(async () => {
    try {
      await disconnectDB();
    } catch (error) {
      console.error(error);
    }
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
