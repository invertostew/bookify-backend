import { Request, Response, NextFunction } from "express";

import { Role, RoleStore } from "../models/RoleStore";

const store = new RoleStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roles = await store.index();

    res.status(200).json(roles);
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
    const role = await store.show(Number(req.params.id));

    res.status(200).json(role);
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
    const role: Role = {
      role: req.body.role
    };

    const newRole = await store.create(role);

    res.status(201).json(newRole);
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
    const role: Role = {
      id: Number(req.params.id),
      role: req.body.role
    };

    const updatedRole = await store.update(role);

    res.status(200).json(updatedRole);
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
    const deletedRole = await store.destroy(Number(req.params.id));

    res.status(200).json(deletedRole);
  } catch (err) {
    next(err);
  }
};
