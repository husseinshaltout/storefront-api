import { User, UserStore } from '../user';
import client from '../../database';
import bcrypt from 'bcrypt';
const store = new UserStore();

const pepper = process.env.BCRYPT_PASSWORD as string;
const saltRounds = process.env.SALT_ROUNDS as string;

describe('User Model tests', () => {
    const u: User = {
        username: 'hussein',
        password: '123',
        first_name: 'amr',
        last_name: 'aly'
    };
    describe('index method tests', () => {
        it('should have an index method', () => {
            expect(store.index).toBeDefined();
        });
        it('index method should return a list of users', async () => {
            const result = await store.index();
            expect(result).toEqual([]);
        });
    });
    describe('show method tests', () => {
        beforeAll(async () => {
            const conn = await client.connect();
            const query =
                'INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *;';
            const result = await conn.query(query, [
                u.username,
                u.password,
                u.first_name,
                u.last_name
            ]);
            conn.release();
        });
        it('should have a show method', () => {
            expect(store.index).toBeDefined();
        });
        it('show method should return a user with id = 1', async () => {
            const result = await store.show('1');
            expect(result).toEqual({
                id: 1,
                username: u.username,
                password: u.password,
                first_name: u.first_name,
                last_name: u.last_name
            });
        });
    });

    describe('create method tests', () => {
        it('should have a create method', () => {
            expect(store.create).toBeDefined();
        });
        it('create method should add user and return it', async () => {
            const result = await store.create(u);
            expect(result.username).toBe(u.username);
            expect(result.first_name).toBe(u.first_name);
            expect(result.last_name).toBe(u.last_name);
        });
        afterAll(async () => {
            const conn = await client.connect();
            const query = `DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        });
    });
    describe('authenticate method tests', () => {
        beforeAll(async () => {
            const conn = await client.connect();
            const query =
                'INSERT INTO users (username, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *;';
            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(query, [u.username, hash, u.first_name, u.last_name]);
            conn.release();
        });
        it('should have a authenticate method', () => {
            expect(store.authenticate).toBeDefined();
        });
        it('authenticate method should check password and user name exist return user', async () => {
            const result = await store.authenticate('hussein', '123');
            expect(result?.username).toBe(u.username);
            expect(result?.first_name).toBe(u.first_name);
            expect(result?.last_name).toBe(u.last_name);
        });
        afterAll(async () => {
            const conn = await client.connect();
            const query = `DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        });
    });
});
