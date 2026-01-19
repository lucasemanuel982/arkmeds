import { Router } from "express";
import * as RaceController from "../controllers/RaceController";
import { validateAcceptRace } from "../middlewares/raceValidation.middleware";

const router = Router();

router.post("/", validateAcceptRace, RaceController.accept);

export { router as raceRoutes };
