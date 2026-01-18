import { Router } from "express";
import * as DriverController from "../controllers/DriverController";
import { validateCreateDriver, validateUpdateDriver } from "../middlewares/driverValidation.middleware";

const router = Router();

router.post("/", validateCreateDriver, DriverController.create);
router.get("/", DriverController.list);
router.get("/:id", DriverController.getById);
router.put("/:id", validateUpdateDriver, DriverController.update);
router.delete("/:id", DriverController.remove);

export { router as driverRoutes };
