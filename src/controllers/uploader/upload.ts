import { RequestHandler } from 'express';
import handleErrorMiddleware from '../../middleware/handle-error-middleware';
import FileHandler from '../../utils/fileHandler';

const upload: RequestHandler = async (req, res) => {
  const body = req.body;

  // console.log(
  //   body.lastModified,
  //   body.lastModifiedDate,
  //   body.webkitRelativePath,
  //   body.name,
  //   body.size,
  //   body.type,
  //   // body.base64,
  // )

  const uploaded = await FileHandler.saveBase64(body);

  res.send({
    name: body.name,
    size: body.size,
    done: uploaded ? 'ok!' : 'not ok!',
  });
};

export default handleErrorMiddleware(upload);
