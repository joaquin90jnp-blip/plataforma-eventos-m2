import { Router } from "express";
import { health, ready } from "../controllers/health.controller.js";
import { methodNotAllowed } from "../middlewares/methodNotAllowed.js";

const router = Router();
router.get("/", health);
router.all("/", methodNotAllowed(["GET", "HEAD"]));
router.get("/ready", ready);
router.all("/ready", methodNotAllowed(["GET", "HEAD"]));
export default router;
