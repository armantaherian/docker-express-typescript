import { RequestHandler } from 'express';
import Joi from '@hapi/joi';
import requestMiddleware from '../../middleware/request-middleware';
import FileHandler from '../../utils/fileHandler';

export const addFileSchema = Joi.object().keys({
  lastModified: Joi.number().required(),
  lastModifiedDate: Joi.string().required(),
  webkitRelativePath: Joi.any(),
  name: Joi.string().required(),
  size: Joi.number().required(),
  type: Joi.string().required(),
  base64: Joi.string().required(),
});

const upload: RequestHandler = async (req, res) => {
  const body = req.body;

  // console.log(
  //   body.lastModified,
  //   body.lastModifiedDate,
  //   body.webkitRelativePath,
  //   body.name,
  //   body.size,
  //   body.type,
  //   body.base64,
  // )

  const uploaded = await FileHandler.saveBase64(body);

  res.send({
    name: body.name,
    size: body.size,
    done: uploaded ? 'ok!' : 'not ok!',
  });
};

export default requestMiddleware(upload, { validation: { body: addFileSchema } });
