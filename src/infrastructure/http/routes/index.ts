import { Router } from "express";
import { healthRoutes } from "./health.routes";
import { driverRoutes } from "./driver.routes";
import { fareRoutes } from "./fare.routes";

const routes = Router();

routes.use("/health", healthRoutes);
routes.use("/driver", driverRoutes);
routes.use("/fare", fareRoutes);

export { routes };
