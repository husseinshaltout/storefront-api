import { OrderProducts, OrderProductsStore } from '../orderProduct';
import { Order, OrderStore } from '../order';
import { Product, ProductStore } from '../product';
import { User, UserStore } from '../user';
import client from '../../database';

const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();
const store = new OrderProductsStore();

describe('OrderProducts Model tests', () => {
    const u: User = {
        username: 'hussein',
        password: '123',
        first_name: 'amr',
        last_name: 'aly'
    };
    const p: Product = {
        name: 'pepsi',
        price: 10,
        category: 'beverage'
    };
    const order: Order = {
        user_id: '1',
        status: 'active'
    };
    const orderProducts: OrderProducts = {
        order_id: '1',
        product_id: '1',
        quantity: 3
    };
    beforeAll(async () => {
        await userStore.create(u);
        await productStore.create(p);
        await orderStore.create(order);
    });
    afterAll(async () => {
        const conn = await client.connect();
        const query = `DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;
        DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART WITH 1;
        DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;`;
        const result = await conn.query(query);
        conn.release();
        return result.rows;
    });
    describe('index method tests', () => {
        it('should have an index method', () => {
            expect(store.index).toBeDefined();
        });
        it('index method should return a list of order products', async () => {
            const result = await store.index();
            expect(result).toEqual([]);
        });
    });

    describe('show method tests', () => {
        beforeAll(async () => {
            const conn = await client.connect();
            const query =
                'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *;';
            const result = await conn.query(query, [
                orderProducts.order_id,
                orderProducts.product_id,
                orderProducts.quantity
            ]);
            conn.release();
        });
        afterAll(async () => {
            const conn = await client.connect();
            const query = `DELETE FROM order_products; ALTER SEQUENCE order_products_id_seq RESTART WITH 1;`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        });

        it('should have a show method', () => {
            expect(store.show).toBeDefined();
        });
        it('show method should return an order with id = 1', async () => {
            const result = await store.show('1');
            expect(result).toEqual({
                id: 1,
                order_id: orderProducts.order_id,
                product_id: orderProducts.product_id,
                quantity: orderProducts.quantity
            });
        });
    });

    describe('create method tests', () => {
        it('should have a create method', () => {
            expect(store.create).toBeDefined();
        });
        it('create method should add user and return it', async () => {
            const result = await store.create(orderProducts);
            expect(result.quantity).toBe(orderProducts.quantity);
            expect(result.order_id).toBe(orderProducts.order_id);
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
