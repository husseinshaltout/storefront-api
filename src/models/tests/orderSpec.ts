import { User, UserStore } from '../user';
import { Order, OrderStore } from '../order';
import client from '../../database';

const userStore = new UserStore();
const store = new OrderStore();

describe('Order Model tests', () => {
    const u: User = {
        username: 'hussein',
        password: '123',
        first_name: 'amr',
        last_name: 'aly'
    };
    const order: Order = {
        user_id: '1',
        status: 'active'
    };

    beforeAll(async () => {
        await userStore.create(u);
    });
    afterAll(async () => {
        const conn = await client.connect();
        const query = `DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
        const result = await conn.query(query);
        conn.release();
        return result.rows;
    });
    describe('index method tests', () => {
        it('should have an index method', () => {
            expect(store.index).toBeDefined();
        });
        it('index method should return a list of orders', async () => {
            const result = await store.index();
            expect(result).toEqual([]);
        });
    });

    describe('show method tests', () => {
        beforeAll(async () => {
            const conn = await client.connect();
            const query = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *;';
            const result = await conn.query(query, [order.user_id, order.status]);
            conn.release();
        });
        afterAll(async () => {
            const conn = await client.connect();
            const query = `DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        });

        it('should have a show method', () => {
            expect(store.show).toBeDefined();
        });
        it('show method should return a order with id = 1', async () => {
            const result = await store.show(1);
            expect(result).toEqual({
                id: 1,
                user_id: order.user_id,
                status: order.status
            });
        });
    });

    describe('create method tests', () => {
        it('should have a create method', () => {
            expect(store.create).toBeDefined();
        });
        it('create method should add order and return it', async () => {
            const result = await store.create(order);
            expect(result.status).toBe(order.status);
            expect(result.user_id).toBe(order.user_id);
        });
        afterAll(async () => {
            const conn = await client.connect();
            const query = `DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        });
    });
    describe('update method tests', () => {
        const completeOrder: Order = {
            id: 1,
            user_id: '1',
            status: 'complete'
        };
        beforeAll(async () => {
            const conn = await client.connect();
            const query = 'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *;';
            const result = await conn.query(query, [order.user_id, order.status]);
            conn.release();
        });
        it('should have a update method', () => {
            expect(store.update).toBeDefined();
        });
        it('update method should change status', async () => {
            const result = await store.update(completeOrder);
            expect(result.status).toBe('complete');
        });
        afterAll(async () => {
            const conn = await client.connect();
            const query = `DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        });
    });
});
