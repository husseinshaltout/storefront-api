import supertest from 'supertest';
import app from '../../modules';
import client from '../../database';
import { User, UserStore } from '../../models/user';
import jwt, { JwtPayload } from 'jsonwebtoken';

const request = supertest(app);
const store = new UserStore();
const secret = process.env.TOKEN_SECRET as string;
let token = '';

describe('Users endpoint test suite', () => {
    const user: User = {
        username: 'test',
        password: 'test',
        first_name: 'test',
        last_name: 'test'
    };
    beforeAll(async () => {
        const newUser = await store.create(user);
        user.id = newUser.id;
    });
    afterAll(async () => {
        const conn = await client.connect();
        const query = `DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
        const result = await conn.query(query);
        conn.release();
        return result.rows;
    });
    describe('login tests', () => {
        it('should authenticate user and return token', async () => {
            const response = await request
                .post('/users/login')
                .set('Content-type', 'application/json')
                .send({
                    username: 'test',
                    password: 'test'
                });
            const decoded = jwt.verify(response.body, secret) as JwtPayload;
            expect(response.status).toBe(200);
            expect(decoded.user.username).toEqual('test');
            expect(decoded.user.first_name).toEqual('test');
            expect(decoded.user.last_name).toEqual('test');
            token = response.body;
        });
        it('wrong login should return 401', async () => {
            const response = await request
                .post('/users/login')
                .set('Content-type', 'application/json')
                .send({
                    username: 'test222',
                    password: 'test222'
                });
            expect(response.status).toBe(401);
        });
    });

    it('should get users index endpoint', async () => {
        const response = await request
            .get('/users')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);

        expect(response.body[0].id).toEqual(user.id);
        expect(response.body[0].username).toEqual(user.username);
        expect(response.body[0].first_name).toEqual(user.first_name);
    });

    it('should create a user', async () => {
        const response = await request
            .post('/users/create')
            .set('Content-type', 'application/json')
            .send({
                username: 'test1',
                password: 'test',
                first_name: 'test1',
                last_name: 'test1'
            });
        const decoded = jwt.verify(response.body, secret) as JwtPayload;
        expect(decoded.user.username).toEqual('test1');
        expect(decoded.user.first_name).toEqual('test1');
        expect(decoded.user.last_name).toEqual('test1');
    });

    it('should show user', async () => {
        const response = await request
            .get(`/users/show/${user.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.body.username).toEqual(user.username);
        expect(response.body.first_name).toEqual(user.first_name);
        expect(response.body.last_name).toEqual(user.last_name);
    });
});
