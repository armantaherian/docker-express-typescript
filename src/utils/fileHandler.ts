import fs, { Stats } from 'fs';
import path from 'path';
import filesize from '../utils/file-size';

const UploadFolderPath: string = path.join(__dirname, '../../uploaded');

interface IBase64File {
  lastModified: number;
  lastModifiedDate: Date;
  webkitRelativePath: string;
  name: string;
  size: number;
  type: string;
  base64: string;
}

class FileHandler {
  // [x: string]: any;
  private localPath: string;
  private formatBase64 = 'base64';

  constructor(localPath: string) {
    this.localPath = localPath;

    if (!fs.existsSync(this.localPath)) {
      fs.mkdirSync(this.localPath);
    }
  }

  saveBase64 = async (file: IBase64File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const base64String = file.base64;
      const data = base64String.split(`;${this.formatBase64},`).pop();
      const filePath = path.join(this.localPath, file.name);

      fs.writeFile(
        filePath, // `${this.path}/${file.name}`,
        data,
        this.formatBase64,
        (err: NodeJS.ErrnoException) => {
          if (err) {
            return reject(err);
          }

          return resolve(true);
        }
      );
    })
  }

  getFiles = async (): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      fs.readdir(this.localPath, (err, files) => {
        if (err) {
          return reject(err);
        }

        return resolve(files);
      });
    });
  }

  getFileSize = async (file: string): Promise<Stats> => {
    return new Promise((resolve, reject) => {
      fs.stat(`${this.localPath}/${file}`, (err, stat) => {
        if (err) return reject(err);

        return resolve(stat);
      });
    });
  }

  standardizeFileSize = (size: number): string => {
    return filesize(size).human('jedec');
  }

  getFilePath = (name: string): string => {
    return `${this.localPath}/${name}`;
  }
}

export default new FileHandler(UploadFolderPath);

// export default {
//   saveBase64: fileHandler.saveBase64,
//   standardizeFileSize: fileHandler.standardizeFileSize,
//   getFilePath: fileHandler.getFilePath,
// }
