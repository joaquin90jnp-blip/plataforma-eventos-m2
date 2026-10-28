import * as eventsDao from "../dao/events.dao.js";

export async function findAll(options) {
  return eventsDao.findAll(options);
}
