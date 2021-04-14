import { Router } from 'express';

import { SignUpController, SignInController } from '../controllers';
import { swagger } from '../swagger';


const routes = Router();


swagger({
  tags:['Sign up'],
  route: '/sign-up',
  method: 'POST',
  description: 'Teste',
  summary: 'Teste',
  responses: [{
    statusCode: 200,
    contentType: 'application/json',
    content: undefined
  }]
});
routes.post('/sign-up', SignUpController.validateSingUp, SignUpController.signUp);

swagger({
  tags:['Sign in'],
  route: '/sign-in',
  method: 'POST',
});
routes.post('/sign-in', SignInController.validateSingIn, SignInController.signIn);

export { routes };
