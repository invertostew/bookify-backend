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

    res.json(roles);
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

    res.json(role);
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

    res.json(newRole);
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

    res.json(updatedRole);
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
    const deletedUser = await store.destroy(Number(req.params.id));

    res.json(deletedUser);
  } catch (err) {
    next(err);
  }
};
