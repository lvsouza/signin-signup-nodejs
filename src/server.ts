import express from "express";
import { errors } from "celebrate";
import swaggerUi from "swagger-ui-express";

import { swaggerSpecification } from "./swagger";
import { routes } from "./routes/Routes";

const app = express();

app.use(express.json());

app.use(routes);

app.use(errors());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification({
  openapi: '3.0.0',
  servers: [{ url: 'http://localhost:3333' }]
})));

app.listen(3333);

console.log('\n🔥 Server running in http://localhost:3333 🔥');
