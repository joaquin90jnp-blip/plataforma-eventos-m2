import { env } from "../config/env.js";

const CLIENT_ERROR_MESSAGES = {
  400: "Solicitud inválida",
  401: "No autorizado",
  403: "Acceso denegado",
  404: "Recurso no encontrado",
  405: "Método no permitido",
  409: "Conflicto",
  413: "Cuerpo de la petición demasiado grande",
  415: "Tipo de contenido no soportado",
};

function isMongooseInputError(err) {
  return err?.name === "ValidationError" || err?.name === "CastError";
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const status = isMongooseInputError(err)
    ? 400
    : Number.isInteger(err.status) && err.status >= 400 && err.status <= 599
      ? err.status
      : 500;

  if (status >= 500 && env.NODE_ENV !== "test") {
    console.error(err);
  }

  let message;
  if (status >= 500) {
    message = "Error interno del servidor";
  } else if (err.type === "entity.parse.failed") {
    message = "JSON inválido";
  } else if (isMongooseInputError(err)) {
    message = "Datos inválidos";
  } else if (err.isOperational === true && err.expose === true) {
    message = err.message;
  } else {
    message = CLIENT_ERROR_MESSAGES[status] ?? "Error en la petición";
  }

  res.status(status).json({ status: "error", message });
}
