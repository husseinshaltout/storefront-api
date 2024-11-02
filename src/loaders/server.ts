import config from '../config';
import Application from './app';
import { DBLoader } from './database';

export default class ServerLoader {
    constructor(private app: Application, private database: DBLoader) {}

    async connectToDatabase() {
        return this.database
            .connect()
            .then(() => console.log('DB connection established'))
            .catch((err) => {
                console.error('Unable to connect to the database');
                console.error(err);
            });
    }

    async closeDatabaseConnection() {
        return this.database.end();
    }

    async start() {
        await this.connectToDatabase();
        this.app
            .startServer(config.PORT)
            .enableBodyParser()
            .enableCors()
            .enableLogger()
            .useApiRouters()
            .redirectToNotFound();
    }
}
