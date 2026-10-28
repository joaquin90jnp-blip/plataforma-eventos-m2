import { getEvents } from "../services/events.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listEvents = asyncHandler(async (req, res) => {
  const payload = await getEvents(req.query);
  res.status(200).json({ status: "success", payload });
});
