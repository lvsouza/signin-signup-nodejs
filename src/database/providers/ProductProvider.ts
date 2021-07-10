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

    const allImages = await Knex(TableNames.image)
      .select('*')
      .innerJoin(TableNames.productImage, `${TableNames.image}.id`, `${TableNames.productImage}.imageId`)
      .whereIn(`${TableNames.productImage}.productId`, products.map(product => product.id));

    products.forEach(product => {
      product.images = allImages.filter(image => image.productId === product.id)
    });

    return products;
  } catch (error) {
    console.log(error)
    return 'Erro ao consultar os produtos na base';
  }
}


const getById = async (id: number): Promise<string | IProduct | undefined> => {
  try {
    const product = await Knex(TableNames.product)
      .select<IProduct[]>('*')
      .where(`${TableNames.product}.id`, id)
      .first();

    if (!product) return undefined;

    product.images = await Knex(TableNames.image)
      .select('*')
      .whereIn(`id`, function () {
        this
          .select('imageId')
          .from(TableNames.productImage)
          .where({ productId: id });
      })

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

const updateById = async (id: number, productToUpdate: Omit<IProduct, 'images'>, imagesToCreate: Omit<IImage, 'id'>[], imagesToUpdate: IImage[], imagesIdToDelete: number[]): Promise<string | boolean> => {
  const trx = await Knex.transaction();

  try {
    const success = await trx(TableNames.product)
      .update(productToUpdate)
      .where({ id });

    if (success === 0) {
      trx.rollback();
      return false;
    }

    if (imagesToCreate.length > 0) {
      try {
        const insertedImagesId = await trx(TableNames.image).insert(imagesToCreate);
        const relations = insertedImagesId.map(imageId => ({
          imageId,
          productId: id,
        }));
        await trx(TableNames.productImage).insert(relations);
      } catch (error) {
        trx.rollback();
        console.log(error);
        return 'Erro ao criar as images do produto na base';
      }
    }

    if (imagesToUpdate.length > 0) {
      try {
        const queries: Promise<any>[] = [];
        imagesToUpdate.forEach(image => {
          queries.push(
            trx(TableNames.image)
              .update(image)
              .where({ id: image.id })
          );
        });
        await Promise.all(queries);
      } catch (error) {
        trx.rollback();
        console.log(error);
        return 'Erro ao atualizar as images do produto na base';
      }
    }

    if (imagesIdToDelete.length > 0) {
      try {
        await trx
          .from(TableNames.image)
          .whereIn(`id`, imagesIdToDelete)
          .del();
      } catch (error) {
        trx.rollback();
        console.log(error);
        return 'Erro ao apagar as images do produto na base';
      }
    }

    trx.commit();
    return true;
  } catch (error) {
    trx.rollback();
    console.log(error);
    return 'Erro ao criar o produto na base';
  }
}

const deleteById = async (id: number): Promise<string | boolean> => {
  try {
    await Knex
      .from(TableNames.image)
      .whereIn(`id`, function () {
        this
          .select('imageId')
          .from(TableNames.productImage)
          .where({ productId: id });
      })
      .del();

    const success = await Knex(TableNames.product)
      .where({ id })
      .del();

    if (success === 1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return 'Erro ao apagar o produto da base';
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
