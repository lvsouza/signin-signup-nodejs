import { NextFunction, Request, Response } from "express";
import { StatusCodes } from 'http-status-codes';

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(StatusCodes.UNAUTHORIZED).send();

  if (authorization !== 'Bearer jwt-123456789-jwt') return res.status(StatusCodes.UNAUTHORIZED).send();

  return next();
}
