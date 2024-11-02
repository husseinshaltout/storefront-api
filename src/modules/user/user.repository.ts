import client from '../../database';
import { User } from './interface/user.interface';

class UserRepository {
    async getAll(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM users`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get users ${error}`);
        }
    }

    async getUserById(id: number): Promise<User> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM users WHERE id='${id}'`;
            const result = await conn.query(query);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot get user with id = ${id}. Error: ${error}`);
        }
    }

    async create(user: User): Promise<User> {
        try {
            const conn = await client.connect();
            const query = `INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *`;

            const result = await conn.query(query, [
                user.username,
                user.password,
                user.first_name,
                user.last_name
            ]);
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot create user: ${error}`);
        }
    }

    async findOneByUsername(username: string): Promise<User | null> {
        try {
            const conn = await client.connect();

            const sql = `SELECT password FROM users WHERE username = '${username}';`;

            const result = await conn.query(sql);

            conn.release();

            if (result.rows.length) return result.rows[0];

            return null;
        } catch (error) {
            throw new Error(`Cannot find user with username ${username}. Error: ${error}`);
        }
    }
}

const userRepository = new UserRepository();
export default userRepository;
