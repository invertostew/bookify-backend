import { Request, Response, NextFunction } from "express";

import { Service, ServiceStore } from "../models/ServiceStore";
import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";
import poundsToPence from "../helpers/poundsToPence";

const { SERVER_URL } = process.env;

const store = new ServiceStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const services = await store.index();

    res.json(services);
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

    const service = await store.show(+id);

    res.json(service);
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
    const {
      title,
      description,
      duration,
      price,
      calendar_id: calendarId
    } = req.body;

    if (!title || !description || !duration || !price || !calendarId) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains 'title', 'description', 'duration', 'price' and 'calendar_id' properties`
      );
    }

    if (Number.isNaN(parseInt(calendarId.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-property-is-nan`,
        "Request body property 'user_id' or 'service_id' is NaN",
        `The calendar_id '${calendarId}' is not a number`
      );
    }

    const service: Service = {
      title,
      description,
      duration,
      price: poundsToPence(price),
      calendar_id: calendarId
    };

    const newService = await store.create(service);

    res.status(201).json(newService);
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

    const {
      title,
      description,
      duration,
      price,
      calendar_id: calendarId
    } = req.body;

    if (!title || !description || !duration || !price || !calendarId) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains 'title', 'description', 'duration', 'price' and 'calendar_id' properties`
      );
    }

    if (Number.isNaN(parseInt(calendarId.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-property-is-nan`,
        "Request body property 'user_id' or 'service_id' is NaN",
        `The calendar_id '${calendarId}' is not a number`
      );
    }

    const service: Service = {
      id: +id,
      title,
      description,
      duration,
      price: poundsToPence(price),
      calendar_id: calendarId
    };

    const updatedService = await store.update(service);

    res.json(updatedService);
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

    const deletedService = await store.destroy(+id);

    res.json(deletedService);
  } catch (err: unknown) {
    next(err);
  }
};
