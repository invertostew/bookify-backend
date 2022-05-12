import { Request, Response, NextFunction } from "express";

import { PaymentStore } from "../models/PaymentStore";
import BadRequestError from "../classes/base_errors/user_facing_errors/BadRequestError";

const { SERVER_URL } = process.env;

const store = new PaymentStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payments = await store.index();

    res.json(payments);
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
    const { id } = req.params;

    if (Number.isNaN(parseInt(id.toString(), 10))) {
      throw new BadRequestError(
        `${SERVER_URL}${req.baseUrl}${req.path}`,
        `${SERVER_URL}/api/problem/parameter-is-nan`,
        "Request parameter 'id' is NaN",
        `The id '${id}' is not a number`
      );
    }

    const payment = await store.show(+id);

    res.json(payment);
  } catch (err) {
    next(err);
  }
};
