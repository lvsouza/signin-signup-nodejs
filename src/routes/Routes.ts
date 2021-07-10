import { Router } from 'express';

import {
  SignUpController,
  SignInController,
  ProductController,
} from '../controllers';
import { ensureAuthenticated } from '../middleware';


const routes = Router();

routes.get('/', (_, res) => res.send('Working...'));
routes.post('/sign-up', SignUpController.validateSingUp, SignUpController.signUp);
routes.post('/sign-in', SignInController.validateSingIn, SignInController.signIn);

// Products CRUD
routes.get('/products', ensureAuthenticated, ProductController.validateGetAll, ProductController.getAll);
routes.post('/products', ensureAuthenticated, ProductController.validateCreate, ProductController.create);
routes.get('/products/:id', ensureAuthenticated, ProductController.validateGetById, ProductController.getById);
routes.put('/products/:id', ensureAuthenticated, ProductController.validateUpdateById, ProductController.updateById);
routes.delete('/products/:id', ensureAuthenticated, ProductController.validateDeleteById, ProductController.deleteById);
routes.get('/products-with-first-image', ensureAuthenticated, ProductController.validateGetAllWithFirstImage, ProductController.getAllWithFirstImage);
routes.get('/products-with-first-image/:id', ensureAuthenticated, ProductController.validateGetByIdWithFirstImage, ProductController.getByIdWithFirstImage);

export { routes };
