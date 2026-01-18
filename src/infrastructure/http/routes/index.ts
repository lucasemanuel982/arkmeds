import { Router } from "express";
import { healthRoutes } from "./health.routes";
import { driverRoutes } from "./driver.routes";
import { passengerRoutes } from "./passenger.routes";

const routes = Router();

routes.use("/health", healthRoutes);
routes.use("/driver", driverRoutes);
routes.use("/passenger", passengerRoutes);

export { routes };
