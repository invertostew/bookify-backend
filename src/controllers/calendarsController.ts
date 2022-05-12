import { Request, Response, NextFunction } from "express";

import { Calendar, CalendarStore } from "../models/CalendarStore";
import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";

const { SERVER_URL } = process.env;

const store = new CalendarStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const calendars = await store.index();

    res.json(calendars);
  } catch (err: unknown) {
    next(err);
  }
};

export const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (Number.isNaN(parseInt(id.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/parameter-is-nan`,
        "Request parameter 'id' is NaN",
        `The id '${id}' is not a number`
      );
    }

    const calendar = await store.show(+id);

    res.json(calendar);
  } catch (err: unknown) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, user_id: userId } = req.body;

    if (!title || !userId) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains 'title', and 'user_id' properties`
      );
    }

    if (Number.isNaN(parseInt(userId.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-property-is-nan`,
        "Request body property 'user_id' or 'service_id' is NaN",
        `The user_id '${userId}' is not a number`
      );
    }

    const calendar: Calendar = {
      title,
      user_id: userId
    };

    const newCalendar = await store.create(calendar);

    res.status(201).json(newCalendar);
  } catch (err: unknown) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (Number.isNaN(parseInt(id.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/parameter-is-nan`,
        "Request parameter 'id' is NaN",
        `The id '${id}' is not a number`
      );
    }

    const { title, user_id: userId } = req.body;

    if (!title || !userId) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains 'title', and 'user_id' properties`
      );
    }

    if (Number.isNaN(parseInt(userId.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-property-is-nan`,
        "Request body property 'user_id' or 'service_id' is NaN",
        `The user_id '${userId}' is not a number`
      );
    }

    const calendar: Calendar = {
      id: +id,
      title,
      user_id: userId
    };

    const updatedCalendar = await store.update(calendar);

    res.json(updatedCalendar);
  } catch (err: unknown) {
    next(err);
  }
};

export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (Number.isNaN(parseInt(id.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/parameter-is-nan`,
        "Request parameter 'id' is NaN",
        `The id '${id}' is not a number`
      );
    }

    const deletedCalendar = await store.destroy(+id);

    res.json(deletedCalendar);
  } catch (err: unknown) {
    next(err);
  }
};

export const listCalendarServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (Number.isNaN(parseInt(id.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/parameter-is-nan`,
        "Request parameter 'id' is NaN",
        `The id '${id}' is not a number`
      );
    }

    const calendarServices = await store.listCalendarServices(+id);

    res.json(calendarServices);
  } catch (err: unknown) {
    next(err);
  }
};

export const listCalendarBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    if (Number.isNaN(parseInt(id.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/parameter-is-nan`,
        "Request parameter 'id' is NaN",
        `The id '${id}' is not a number`
      );
    }

    const calendarBookings = await store.listCalendarBookings(+id);

    res.json(calendarBookings);
  } catch (err: unknown) {
    next(err);
  }
};
