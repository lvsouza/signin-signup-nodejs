import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { celebrate, Joi } from "celebrate";

import { ProductProvider } from "../../../database/providers";

export const validateGetAllWithFirstImage = celebrate({
  query: Joi.object({
    search: Joi.string(),
    page: Joi.number().min(1),
    limit: Joi.number().min(1),
  }),
});

export const getAllWithFirstImage = async (req: Request, res: Response) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  const products = await ProductProvider.getAllWithFirstImage(Number(page), Number(limit), String(search));
  const count = await ProductProvider.count();

  if (typeof products === 'string') {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(products);
  } else if (typeof count === 'string') {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(count);
  } else {
    res.setHeader('access-control-expose-headers', 'x-total-count');
    res.setHeader('x-total-count', count);
    return res.status(StatusCodes.OK).json(products);
  }
}
