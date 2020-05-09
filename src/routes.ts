import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import apiSpec from '../openapi.json';

import * as BookController from './controllers/book';

import files from "./routes/files";
import auth from "./routes/auth";
import user from "./routes/user";

const router = Router();

// Book routes
router.post('/book/add', BookController.add);
router.get('/book/all', BookController.all);
router.get('/book/search', BookController.search);

router.use("/files", files);
router.use("/auth", auth);
router.use("/user", user);

// Dev routes
if (process.env.NODE_ENV === 'development') {
  const swaggerUiOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
  };

  router.use('/dev/api-docs', swaggerUi.serve);
  router.get('/dev/api-docs', swaggerUi.setup(apiSpec, swaggerUiOptions));
}

export default router;
