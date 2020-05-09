import { RequestHandler } from 'express';
import FileHandler from '../../utils/fileHandler';
import requestMiddleware from '../../middlewares/request-middleware';

const download: RequestHandler = async (req, res) => {
  res.sendFile(FileHandler.getFilePath(req.params.id));
};

export default requestMiddleware(download);
