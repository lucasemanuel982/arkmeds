import { Router } from "express";
import * as FareController from "../controllers/FareController";
import { validateCalculateFare } from "../middlewares/fareValidation.middleware";

const router = Router();

router.post("/", validateCalculateFare, FareController.calculate);

export { router as fareRoutes };
