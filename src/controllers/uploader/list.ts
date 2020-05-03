import { RequestHandler } from 'express';
import { Stats } from 'fs';
import requestMiddleware from '../../middleware/request-middleware';
import FileHandler from '../../utils/fileHandler';

const list: RequestHandler = async (_req, res) => {
  const filesList = await FileHandler.getFiles();

  const getSizePromiseList: Promise<Stats>[] = filesList.map(
    (file: string) => FileHandler.getFileSize(file)
  );

  const getSizeResult = await Promise.all(getSizePromiseList);

  const filesListWithSize = filesList.map(
    (file: string, index: number) => ({
      name: file,
      size: FileHandler.standardizeFileSize(getSizeResult[index].size),
    })
  );

  res.render('pages/upload/list', {
    filesList: filesListWithSize,
  });
};

export default requestMiddleware(list);
