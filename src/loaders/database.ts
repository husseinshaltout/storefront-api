import { Pool } from 'pg';
import config from '../config';

export class DBLoader {
    // eslint-disable-next-line no-use-before-define
    private static instance: DBLoader;
    private client: Pool;

    constructor() {
        this.client = new Pool({
            host: config.DATABASE.HOST,
            database: config.DATABASE.NAME,
            user: config.DATABASE.USER,
            password: config.DATABASE.PASSWORD,
            port: config.DATABASE.PORT
        });
    }

    public static getInstance(): DBLoader {
        if (!DBLoader.instance) {
            DBLoader.instance = new DBLoader();
        }
        return DBLoader.instance;
    }

    getClient() {
        return this.client;
    }

    connect() {
        return this.client.connect();
    }

    end() {
        return this.client.end();
    }
}

export default DBLoader.getInstance();
