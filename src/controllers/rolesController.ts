import { Request, Response, NextFunction } from "express";

import { Role, RoleStore } from "../models/RoleStore";
import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";

const { SERVER_URL } = process.env;

const store = new RoleStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const roles = await store.index();

    res.json(roles);
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

    const role = await store.show(+id);

    res.json(role);
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
    if (!req.body.role) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains a 'role' property`
      );
    }

    const role: Role = {
      role: req.body.role
    };

    const newRole = await store.create(role);

    res.status(201).json(newRole);
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

    if (!req.body.role) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains a 'role' property`
      );
    }

    const role: Role = {
      id: +id,
      role: req.body.role
    };

    const updatedRole = await store.update(role);

    res.json(updatedRole);
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

    const deletedRole = await store.destroy(+id);

    res.json(deletedRole);
  } catch (err: unknown) {
    next(err);
  }
};
