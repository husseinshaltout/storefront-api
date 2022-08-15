import { Product, ProductStore } from '../product';
import client from '../../database';
const store = new ProductStore();

describe('Product Model tests', () => {
    const p: Product = {
        name: 'pepsi',
        price: 10,
        category: 'beverage'
    };
    describe('index method tests', () => {
        it('should have an index method', () => {
            expect(store.index).toBeDefined();
        });
        it('index method should return a list of products', async () => {
            const result = await store.index();
            expect(result).toEqual([]);
        });
    });
    describe('show method tests', () => {
        beforeAll(async () => {
            const conn = await client.connect();
            const query =
                'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(query, [p.name, p.price, p.category]);
            conn.release();
        });
        it('should have a show method', () => {
            expect(store.index).toBeDefined();
        });
        it('show method should return a product with id = 1', async () => {
            const result = await store.show('1');
            expect(result).toEqual({
                id: 1,
                name: p.name,
                price: p.price,
                category: p.category
            });
        });
    });
    describe('showByCategory method tests', () => {
        beforeAll(async () => {
            const conn = await client.connect();
            const query =
                'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(query, [p.name, p.price, p.category]);
            conn.release();
        });
        it('should have a show showByCategory', () => {
            expect(store.showByCategory).toBeDefined();
        });
        it('showByCategory method should return a product with category = beverage', async () => {
            const result = await store.showByCategory('beverage');
            expect(result[0].name).toBe(p.name);
            expect(result[0].price).toBe(p.price);
            expect(result[0].category).toBe(p.category);
        });
    });
    describe('create method tests', () => {
        it('should have a create method', () => {
            expect(store.create).toBeDefined();
        });
        it('create method should add product and return it', async () => {
            const result = await store.create(p);
            expect(result.name).toBe(p.name);
            expect(result.price).toBe(p.price);
            expect(result.category).toBe(p.category);
        });
        afterAll(async () => {
            const conn = await client.connect();
            const query = `DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART WITH 1;`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        });
    });
});
