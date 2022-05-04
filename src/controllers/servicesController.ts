import { Request, Response, NextFunction } from "express";

import { Service, ServiceStore } from "../models/ServiceStore";

const store = new ServiceStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const services = await store.index();

    res.status(200).json(services);
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
    const service = await store.show(Number(req.params.id));

    res.status(200).json(service);
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
    const service: Service = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      price: req.body.price
    };

    const newService = await store.create(service);

    res.status(201).json(newService);
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
    const service: Service = {
      title: req.body.title,
      description: req.body.description,
      duration: req.body.duration,
      price: req.body.price
    };

    const updatedService = await store.update(service);

    res.status(200).json(updatedService);
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
    const deletedService = await store.destroy(Number(req.params.id));

    res.status(200).json(deletedService);
  } catch (err) {
    next(err);
  }
};
