import mongoose, { ConnectionOptions } from 'mongoose';
import logger from './logger';
import { createConnection } from 'typeorm';

(<any>mongoose).Promise = global.Promise;

/** Callback for establishing or re-stablishing mongo connection */
interface IOnConnectedCallback {
  (): void;
}

/**
 * A Mongoose Connection wrapper class to
 * help with mongo connection issues.
 *
 * This library tries to auto-reconnect to
 * MongoDB without crashing the server.
 * @author Sidhant Panda
 */
export default class MongoConnection {
  /** URL to access mongo */
  private readonly mongoUrl: string;
  private readonly mongoPort: string;
  private readonly mongoDc: string;

  /** Callback when mongo connection is established or re-established */
  private onConnectedCallback: IOnConnectedCallback;

  /**
   * Internal flag to check if connection established for
   * first time or after a disconnection
   */
  private isConnectedBefore: boolean = false;

  /** Mongo connection options to be passed Mongoose */
  private readonly mongoConnectionOptions: ConnectionOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  };

  /**
   * Start mongo connection
   * @param mongoUrl MongoDB URL
   * @param onConnectedCallback callback to be called when mongo connection is successful
   */
  constructor(mongoUrl: string, mongoDc: string, mongoPort: string) {
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }

    this.mongoUrl = mongoUrl;
    this.mongoPort = mongoPort;
    this.mongoDc = mongoDc;
    mongoose.connection.on('error', this.onError);
    mongoose.connection.on('disconnected', this.onDisconnected);
    mongoose.connection.on('connected', this.onConnected);
    mongoose.connection.on('reconnected', this.onReconnected);
  }

  private getMongoUrl() {
    return `mongodb://${this.mongoUrl}:${this.mongoPort}/${this.mongoDc}`
  }

  /** Close mongo connection */
  public close(onClosed: (err: any) => void) {
    logger.log({
      level: 'info',
      message: 'Closing the MongoDB connection'
    });
    // noinspection JSIgnoredPromiseFromCall
    mongoose.connection.close(onClosed);
  }

  /** Start mongo connection */
  public connect(onConnectedCallback: IOnConnectedCallback) {
    this.onConnectedCallback = onConnectedCallback;
    this.startConnection();
  }

  private startConnection = () => {
    logger.log({
      level: 'info',
      message: `Connecting to MongoDB at ${this.getMongoUrl()}`
    });

    // TypeORM Connection
    createConnection({
      type: "mongodb",
      host: this.mongoUrl,
      port: Number(this.mongoPort),
      database: this.mongoDc,
      // username: "root",
      // password: "admin",
      entities: [
        __dirname + "/models/entity/*.ts"
      ],
      migrations: [
        __dirname + "/migrations/*.ts"
      ],
      synchronize: true,
      logging: ["query", "error"],
      cli: {
        migrationsDir: "migrations",
      },
      useUnifiedTopology: true,
    }).then(() => {
      logger.log({
        level: 'info',
        message: "Connected to MongoDB by TypeORM",
      })
    }).catch((error: any) => {
      logger.log({
        level: 'error',
        message: error,
      })
    });

    // And mongoose connection,
    // I have to keep both for now.
    mongoose.connect(
      this.getMongoUrl(),
      this.mongoConnectionOptions,
    ).catch((error: any) => {
      logger.log({
        level: 'error',
        message: error,
      });
    });
  }

  /**
   * Handler called when mongo connection is established
   */
  private onConnected = () => {
    logger.log({
      level: 'info',
      message: `Connected to MongoDB at ${this.getMongoUrl()}`
    });
    this.isConnectedBefore = true;
    this.onConnectedCallback();
  };

  /** Handler called when mongo gets re-connected to the database */
  private onReconnected = () => {
    logger.log({
      level: 'info',
      message: 'Reconnected to MongoDB'
    });
    this.onConnectedCallback();
  };

  /** Handler called for mongo connection errors */
  private onError = () => {
    logger.log({
      level: 'error',
      message: `Could not connect to ${this.getMongoUrl()}`
    });
  };

  /** Handler called when mongo connection is lost */
  private onDisconnected = () => {
    if (!this.isConnectedBefore) {
      setTimeout(() => {
        this.startConnection();
      }, 2000);
      logger.log({
        level: 'info',
        message: 'Retrying mongo connection'
      });
    }
  };
}
