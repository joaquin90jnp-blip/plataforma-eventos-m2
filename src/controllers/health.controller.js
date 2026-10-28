import mongoose from "mongoose";

export function health(req, res) {
  res.status(200).json({ status: "ok", message: "Servidor activo" });
}

export function ready(req, res) {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? "ok" : "error",
    message: connected
      ? "Base de datos conectada"
      : "Base de datos no disponible",
  });
}
