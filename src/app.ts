import bodyParser from 'body-parser';
import compression from 'compression';
import path from 'path';
import express, { Request, Response, NextFunction } from 'express';
import engine from 'ejs-locals';
import cookieParser from 'cookie-parser';
import statusMonitor from 'express-status-monitor';
import ApplicationError from './errors/application-error';
import routes from './routes';

const app = express();

app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression());
app.use(bodyParser.json({
  limit: '50mb',
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(statusMonitor());

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use(routes);

app.use((err: ApplicationError, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err : undefined,
    message: err.message
  });
});

export default app;
