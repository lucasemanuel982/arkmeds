import { Router } from "express";
import * as PassengerController from "../controllers/PassengerController";
import { validateCreatePassenger, validateUpdatePassenger } from "../middlewares/passengerValidation.middleware";

const router = Router();

router.post("/", validateCreatePassenger, PassengerController.create);
router.get("/", PassengerController.list);
router.get("/:id", PassengerController.getById);
router.put("/:id", validateUpdatePassenger, PassengerController.update);
router.delete("/:id", PassengerController.remove);

export { router as passengerRoutes };
