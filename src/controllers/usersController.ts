import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { User, UserStore } from "../models/UserStore";
import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";

const { JWT_SECRET, SERVER_URL } = process.env;

const store = new UserStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await store.index();

    res.json(users);
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

    const user = await store.show(+id);

    res.json(user);
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
      username,
      email_address: emailAddress,
      password,
      first_name: firstName,
      last_name: lastName,
      role_name: roleName
    } = req.body;

    if (
      !username ||
      !emailAddress ||
      !password ||
      !firstName ||
      !lastName ||
      !roleName
    ) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains 'username', 'email_address', 'password', 'first_name', 'last_name', and 'role_name' properties`
      );
    }

    const user: User = {
      username,
      email_address: emailAddress,
      password,
      first_name: firstName,
      last_name: lastName
    };

    const newUser = await store.create(user, roleName);

    const token = jwt.sign(
      {
        user_id: newUser.id,
        role_id: newUser.role_id
      },
      JWT_SECRET as string,
      {
        expiresIn: "7d"
      }
    );

    res.status(201).json({ token });
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
      username,
      email_address: emailAddress,
      password,
      first_name: firstName,
      last_name: lastName
    } = req.body;

    if (!username || !emailAddress || !password || !firstName || !lastName) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains 'username', 'email_address', 'password', 'first_name', and 'last_name' properties`
      );
    }

    const user: User = {
      id: +id,
      username,
      email_address: emailAddress,
      password,
      first_name: firstName,
      last_name: lastName
    };

    const updatedUser = await store.update(user);

    res.json(updatedUser);
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

    const deletedUser = await store.destroy(+id);

    res.json(deletedUser);
  } catch (err: unknown) {
    next(err);
  }
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/req-body-missing`,
        "Request body is missing properties",
        `Ensure that the request body contains 'username' and 'password' properties`
      );
    }

    const user = {
      username,
      password
    };

    const authenticatedUser = await store.authenticate(
      user.username,
      user.password
    );

    const token = jwt.sign(
      {
        user_id: authenticatedUser.id,
        role_id: authenticatedUser.role_id
      },
      JWT_SECRET as string,
      {
        expiresIn: "7d"
      }
    );

    res.json({ token });
  } catch (err: unknown) {
    next(err);
  }
};

export const listUserCalendars = async (
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

    const calendars = await store.listUserCalendars(+id);

    res.json(calendars);
  } catch (err: unknown) {
    next(err);
  }
};

export const showUserCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id, calendarId } = req.params;

    if (Number.isNaN(parseInt(id.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/parameter-is-nan`,
        "Request parameter 'id' is NaN",
        `Ensure that the users id '${id}' and the calendars id '${calendarId}' are numbers`
      );
    }

    const calendar = await store.showUserCalendar(+id, +calendarId);

    res.json(calendar);
  } catch (err: unknown) {
    next(err);
  }
};
