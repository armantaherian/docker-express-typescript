import { RequestHandler } from 'express';
import requestMiddleware from '../../middleware/request-middleware';

const home: RequestHandler = async (_req, res) => {
  res.render('pages/upload/index');
};

export default requestMiddleware(home);
