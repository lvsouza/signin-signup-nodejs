import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { StatusCodes } from "http-status-codes";

import { ProductProvider } from "../../../database/providers";

export const validateGetById = celebrate({
  params: Joi.object({
    id: Joi.number().min(1).required(),
  }),
});

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await ProductProvider.getById(Number(id));

  if (product === undefined) {
    return res.status(StatusCodes.NOT_FOUND).send('Produto não encontrado');
  } else if (typeof product === 'string') {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(product);
  } else {
    return res.status(StatusCodes.OK).json(product);
  }
}
