import { Request, Response, NextFunction } from "express";

import { Calendar, CalendarStore } from "../models/CalendarStore";

const store = new CalendarStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const calendars = await store.index();

    res.status(200).json(calendars);
  } catch (err) {
    next(err);
  }
};

export const show = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const calendar = await store.show(Number(req.params.id));

    res.status(200).json(calendar);
  } catch (err) {
    next(err);
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const calendar: Calendar = {
      title: req.body.title,
      user_id: req.body.user_id
    };

    const newCalendar = await store.create(calendar);

    res.status(201).json(newCalendar);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const calendar: Calendar = {
      id: Number(req.params.id),
      title: req.body.title,
      user_id: req.body.user_id
    };

    const updatedCalendar = await store.update(calendar);

    res.status(200).json(updatedCalendar);
  } catch (err) {
    next(err);
  }
};

export const destroy = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deletedCalendar = await store.destroy(Number(req.params.id));

    res.status(200).json(deletedCalendar);
  } catch (err) {
    next(err);
  }
};

export const listCalendarServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const calendarServices = await store.listCalendarServices(
      Number(req.params.id)
    );

    res.status(200).json(calendarServices);
  } catch (err) {
    next(err);
  }
};

export const listCalendarBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const calendarBookings = await store.listCalendarBookings(
      Number(req.params.id)
    );

    res.status(200).send(calendarBookings);
  } catch (err) {
    next(err);
  }
};
