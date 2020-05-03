import { RequestHandler } from 'express';
import FileHandler from '../../utils/fileHandler';
import handleErrorMiddleware from '../../middleware/handle-error-middleware';

const download: RequestHandler = async (req, res) => {
  res.sendFile(FileHandler.getFilePath(req.params.id));
};

export default handleErrorMiddleware(download);
