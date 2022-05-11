import express, { Router, Request, Response } from "express";

import rolesRouter from "./rolesRouter";
import usersRouter from "./usersRouter";
import calendarsRouter from "./calendarsRouter";
import servicesRouter from "./servicesRouter";
import bookingsRouter from "./bookingsRouter";
import paymentsRouter from "./paymentsRouter";

const apiRouter: Router = express.Router();

apiRouter.use(express.json());

apiRouter.get("/", (_req: Request, res: Response) => {
  res.json({ greeting: "Welcome to the Bookify API!" });
});

apiRouter.use("/roles", rolesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/calendars", calendarsRouter);
apiRouter.use("/services", servicesRouter);
apiRouter.use("/bookings", bookingsRouter);
apiRouter.use("/payments", paymentsRouter);

export default apiRouter;
