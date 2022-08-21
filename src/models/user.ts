import client from '../database';
import bcrypt from 'bcrypt';

export type User = {
    id?: number;
    username: string;
    password: string;
    first_name: string;
    last_name: string;
};

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = process.env.SALT_ROUNDS as string;

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM users`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get users ${err}`);
        }
    }

    async show(id: string): Promise<User> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM users WHERE id='${id}'`;
            const result = await conn.query(query);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot get user with id = ${id}. Error: ${err}`);
        }
    }

    async create(user: User): Promise<User> {
        try {
            const conn = await client.connect();
            const query = `INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *`;

            const hash = bcrypt.hashSync(user.password + pepper, parseInt(saltRounds));
            const result = await conn.query(query, [
                user.username,
                hash,
                user.first_name,
                user.last_name
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot create user: ${err}`);
        }
    }

    async authenticate(username: string, password: string): Promise<User | null> {
        const conn = await client.connect();

        const sql = `SELECT * FROM users WHERE username = '${username}';`;

        const result = await conn.query(sql);

        if (result.rows.length) {
            // In case there is a username match, we need to authenticate that the password sent was correct.
            const user = result.rows[0];
            if (bcrypt.compareSync(password + pepper, user.password)) {
                return user;
            }
        } else {
            // User with username not found
            return null;
        }
        return null;
    }
}
