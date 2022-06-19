import express, { Router } from "express";
import { HealthCheckController, ChargeRequestTest } from "../../controllers/healthCheck/HealthCheckController";

const healthCheckRoute: Router = express.Router();

healthCheckRoute.get("/healthcheck", HealthCheckController);
healthCheckRoute.get("/charge-test/", ChargeRequestTest);
export { healthCheckRoute };
