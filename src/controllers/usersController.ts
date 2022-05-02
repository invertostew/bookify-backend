import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { User, UserStore } from "../models/UserStore";

const store = new UserStore();

const { JWT_SECRET } = process.env;

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await store.index();

    res.status(200).json(users);
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
    const user = await store.show(Number(req.params.id));

    res.status(200).json(user);
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
    const user: User = {
      username: req.body.username,
      emailAddress: req.body.emailAddress,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      roleId: req.body.roleId
    };

    const newUser = await store.create(user);

    const token = jwt.sign({ user: newUser }, JWT_SECRET as string);

    res.status(201).json(token);
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
    const user: User = {
      id: Number(req.params.id),
      username: req.body.username,
      emailAddress: req.body.emailAddress,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      roleId: req.body.roleId
    };

    const updatedUser = await store.update(user);

    res.status(200).json(updatedUser);
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

    res.status(200).json(deletedUser);
  } catch (err) {
    next(err);
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password
    };

    const authenticatedUser = await store.authenticate(
      user.username,
      user.password
    );
    const token = jwt.sign({ user: authenticatedUser }, JWT_SECRET as string);

    res.status(200).json(token);
  } catch (err) {
    next(err);
  }
};
