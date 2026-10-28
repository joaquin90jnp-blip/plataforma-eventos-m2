import * as eventsRepository from "../repositories/events.repository.js";
import { toPublicEvent } from "../models/Event.js";
import { httpError } from "../utils/httpError.js";

export const DEFAULT_EVENTS_LIMIT = 20;
export const MAX_EVENTS_LIMIT = 100;
const PAGINATION_ERROR = "Parámetros de paginación inválidos";

function parseInteger(value, { min, max }) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    throw httpError(400, PAGINATION_ERROR);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < min || parsed > max) {
    throw httpError(400, PAGINATION_ERROR);
  }
  return parsed;
}

/**
 * Normaliza `limit` y `offset` desde el query string.
 * Valores ausentes usan 20 y 0; los inválidos producen 400.
 */
export function parsePagination({ limit, offset } = {}) {
  return {
    limit:
      limit === undefined || limit === ""
        ? DEFAULT_EVENTS_LIMIT
        : parseInteger(limit, { min: 1, max: MAX_EVENTS_LIMIT }),
    offset:
      offset === undefined || offset === ""
        ? 0
        : parseInteger(offset, { min: 0, max: Number.MAX_SAFE_INTEGER }),
  };
}

export async function getEvents(query = {}) {
  const pagination = parsePagination(query);
  const events = await eventsRepository.findAll(pagination);
  return events.map(toPublicEvent);
}
