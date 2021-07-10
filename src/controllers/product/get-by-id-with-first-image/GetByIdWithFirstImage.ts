import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { celebrate, Joi } from "celebrate";

import { ProductProvider } from "../../../database/providers";

export const validateGetByIdWithFirstImage = celebrate({
  params: Joi.object({
    id: Joi.number().min(1).required(),
  }),
});

export const getByIdWithFirstImage = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await ProductProvider.getByIdWithFirstImage(Number(id));

  if (product === undefined) {
    return res.status(StatusCodes.NOT_FOUND).send('Produto não encontrado');
  } else if (typeof product === 'string') {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(product);
  } else {
    return res.status(StatusCodes.OK).json(product);
  }
}
