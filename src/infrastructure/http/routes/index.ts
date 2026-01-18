import { Router } from "express";
import { healthRoutes } from "./health.routes";
import { driverRoutes } from "./driver.routes";

const routes = Router();

routes.use("/health", healthRoutes);
routes.use("/driver", driverRoutes);

export { routes };
