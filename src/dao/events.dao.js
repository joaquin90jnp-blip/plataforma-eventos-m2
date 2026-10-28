import Event from "../models/Event.js";

export async function findAll({ limit = 20, offset = 0 } = {}) {
  return Event.find().sort({ date: 1 }).skip(offset).limit(limit).lean();
}
