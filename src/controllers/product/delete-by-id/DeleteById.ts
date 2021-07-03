import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { StatusCodes } from "http-status-codes";

import { ProductProvider } from "../../../database/providers";

export const validateDeleteById = celebrate({
  params: Joi.object({
    id: Joi.number().min(1).required(),
  }),
});

export const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await ProductProvider.deleteById(Number(id));

  if (typeof result === 'string') {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(result);
  } else if (result === false) {
    return res.status(StatusCodes.NOT_FOUND).send('Produto não encontrado');
  } else {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
}
