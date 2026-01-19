import { Router } from "express";
import { healthRoutes } from "./health.routes";
import { driverRoutes } from "./driver.routes";
import { fareRoutes } from "./fare.routes";
import { passengerRoutes } from "./passenger.routes";
import { raceRoutes } from "./race.routes";

const routes = Router();

routes.use("/health", healthRoutes);
routes.use("/driver", driverRoutes);
routes.use("/fare", fareRoutes);
routes.use("/passenger", passengerRoutes);
routes.use("/race", raceRoutes);

export { routes };
