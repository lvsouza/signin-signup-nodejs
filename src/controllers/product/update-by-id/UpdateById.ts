import { Request, Response } from "express";
import { celebrate, Joi } from "celebrate";
import { StatusCodes } from "http-status-codes";

import { ProductProvider } from "../../../database/providers";

export const validateUpdateById = celebrate({
  params: Joi.object({
    id: Joi.number().min(1).required(),
  }),
  body: Joi.object({
    category: Joi.string(),
    price: Joi.number().required(),
    stock: Joi.number().required(),
    discount: Joi.number().required(),
    description: Joi.string().required(),
    imagesToCreate: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        type: Joi.string().required(),
        content: Joi.string().required(),
      }),
    ),
    imagesToUpdate: Joi.array().items(
      Joi.object({
        id: Joi.number().min(1).required(),
        name: Joi.string().required(),
        type: Joi.string().required(),
        content: Joi.string().required(),
      }),
    ),
    imagesIdToDelete: Joi.array().items(
      Joi.number().min(1).required(),
    ),
  }),
});

export const updateById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { imagesIdToDelete = [], imagesToUpdate = [], imagesToCreate = [] } = req.body;

  delete req.body.imagesIdToDelete;
  delete req.body.imagesToUpdate;
  delete req.body.imagesToCreate;

  const result = await ProductProvider.updateById(Number(id), req.body, imagesToCreate, imagesToUpdate, imagesIdToDelete);

  if (typeof result === 'string') {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(result);
  } else if (result === false) {
    return res.status(StatusCodes.NOT_FOUND).send('Produto não encontrado');
  } else {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
}
