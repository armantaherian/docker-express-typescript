import { RequestHandler } from 'express';
import handleErrorMiddleware from '../../middleware/handle-error-middleware';

const home: RequestHandler = async (_req, res) => {
  res.render('pages/upload/index');
};

export default handleErrorMiddleware(home);
