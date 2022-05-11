import { Request, Response, NextFunction } from "express";

import { PaymentStore } from "../models/PaymentStore";

const store = new PaymentStore();

export const index = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payments = await store.index();

    res.status(200).json(payments);
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
    const payment = await store.show(Number(req.params.id));

    res.status(200).json(payment);
  } catch (err) {
    next(err);
  }
};
