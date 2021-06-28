import { TableNames } from "../TableNames";
import { IImage } from "./ImageProvider";
import { Knex } from "../connection";

export interface IProduct {
  id: number;
  price: number;
  stock: number;
  discount: number;
  images: IImage[];
  category?: string;
  description?: string;
}

const getAll = async (page = 1, limit = 10, search = ''): Promise<string | IProduct[]> => {
  try {
    const products = await Knex(TableNames.product)
      .select<IProduct[]>('*')
      .where('description', 'like', `%${search}%`)
      .offset((page - 1) * limit)
      .limit(limit);
    return products;
  } catch (error) {
    console.log(error)
    return 'Erro ao consultar os produtos na base';
  }
}

const getById = async (id: number): Promise<string | IProduct> => {
  try {
    const product = await Knex(TableNames.product)
      .select<IProduct[]>('*')
      .where({ id })
      .first();

    if (!product) return 'Produto não encontrado';

    return product;
  } catch (error) {
    return 'Erro ao consultar o produto na base';
  }
}

const create = async ({ images, ...productToCreate }: Omit<IProduct, 'id'>): Promise<string | number> => {
  const trx = await Knex.transaction();

  try {
    const [insertedId] = await trx(TableNames.product).insert(productToCreate);

    if (images.length > 0) {
      const insertedImagesId = await trx(TableNames.image).insert(images);
      const relations = insertedImagesId.map(imageId => ({
        imageId,
        productId: insertedId,
      }));

      await trx(TableNames.productImage).insert(relations);
    }

    trx.commit();
    return insertedId;
  } catch (error) {
    trx.rollback();
    console.log(error);
    return 'Erro ao criar o produto na base';
  }
}

const updateById = async (id: number, productToUpdate: IProduct): Promise<string | IProduct> => {
  try {
    await Knex(TableNames.product)
      .update(productToUpdate)
      .where({ id });

    return productToUpdate;
  } catch (error) {
    return 'Erro ao atualizar o produto na base';
  }
}

const deleteById = async (id: number): Promise<string | void> => {
  try {
    await Knex
      .delete(TableNames.image)
      .innerJoin(
        `${TableNames.productImage}`,
        `${TableNames.productImage}.imageId`,
        `${TableNames.image}.id`
      )
      .where(`${TableNames.productImage}.productId`, '=', id);

    await Knex
      .delete(TableNames.product)
      .where({ id });
  } catch (error) {
    return 'Erro ao consultar o produto na base';
  }
}

const count = async () => {
  try {
    const [{ count }] = await Knex(TableNames.product).count('* as count');
    return Number(count);
  } catch (error) {
    return 'Erro ao acessar a base';
  }
}

export const ProductProvider = {
  count,
  getAll,
  create,
  getById,
  updateById,
  deleteById,
}
