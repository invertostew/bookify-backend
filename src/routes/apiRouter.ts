import express, { Router, Request, Response } from "express";

import rolesRouter from "./rolesRouter";
import usersRouter from "./usersRouter";
import calendarsRouter from "./calendarsRouter";
import servicesRouter from "./servicesRouter";
import bookingsRouter from "./bookingsRouter";

const apiRouter: Router = express.Router();

apiRouter.use(express.json());

apiRouter.get("/", (_req: Request, res: Response) => {
  res.send("You have reached the API");
});

apiRouter.use("/roles", rolesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/calendars", calendarsRouter);
apiRouter.use("/services", servicesRouter);
apiRouter.use("/bookings", bookingsRouter);

export default apiRouter;
