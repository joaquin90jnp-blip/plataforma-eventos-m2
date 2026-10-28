import mongoose from "mongoose";

// Falla rápido si Mongo no es alcanzable (el default del driver es 30 s).
export const SERVER_SELECTION_TIMEOUT_MS = 5000;

export async function connectDB(uri) {
  if (!uri) {
    throw new Error(
      "MONGO_URL no está configurada. Copiá .env.example a .env y definí la cadena de conexión.",
    );
  }
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
  });
  return mongoose.connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
