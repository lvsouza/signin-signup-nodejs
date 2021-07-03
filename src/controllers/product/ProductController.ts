import { deleteById, validateDeleteById } from './delete-by-id/DeleteById';
import { updateById, validateUpdateById } from './update-by-id/UpdateById';
import { getById, validateGetById } from './get-by-id/GetById';
import { getAll, validateGetAll } from './get-all/GetAll';
import { create, validateCreate } from './create/Create';

export const ProductController = {
    getAll,
    validateGetAll,
    create,
    validateCreate,
    getById,
    validateGetById,
    deleteById,
    validateDeleteById,
    updateById,
    validateUpdateById,
}
