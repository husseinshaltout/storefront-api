import { Pool } from 'pg';
import DBLoaderInstance, { DBLoader } from '../../loaders/database';
import { User } from './interface/user.interface';

class UserRepository {
    private dbLoader: DBLoader;
    private client: Pool;

    constructor() {
        this.dbLoader = DBLoaderInstance;
        this.client = this.dbLoader.getClient();
    }

    async getAll(): Promise<User[]> {
        try {
            const query = `SELECT id, username, first_name, last_name FROM users`;
            const result = await this.client.query(query);

            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get users ${error}`);
        }
    }

    async getUserById(id: number): Promise<User> {
        try {
            const query = `SELECT * FROM users WHERE id='${id}'`;
            const result = await this.client.query(query);

            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot get user with id = ${id}. Error: ${error}`);
        }
    }

    async create(user: User): Promise<User> {
        try {
            const query = `INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *`;

            const result = await this.client.query(query, [
                user.username,
                user.password,
                user.first_name,
                user.last_name
            ]);

            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot create user: ${error}`);
        }
    }

    async findOneByUsername(username: string): Promise<User | null> {
        try {
            const sql = `SELECT *  FROM users WHERE username = '${username}';`;
            const result = await this.client.query(sql);

            if (result.rows.length) return result.rows[0];
            return null;
        } catch (error) {
            throw new Error(`Cannot find user with username ${username}. Error: ${error}`);
        }
    }
}

const userRepository = new UserRepository();
export default userRepository;
