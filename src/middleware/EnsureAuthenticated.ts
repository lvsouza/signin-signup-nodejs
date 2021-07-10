import { NextFunction, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(StatusCodes.UNAUTHORIZED).send();

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer') return res.status(StatusCodes.UNAUTHORIZED).send();

  if (!process.env.SECRET) return res.status(StatusCodes.UNAUTHORIZED).send();

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    return next();
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).send();
  }
}
