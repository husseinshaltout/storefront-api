import supertest from 'supertest';
import app from '../../server';
import client from '../../database';
import { Product, ProductStore } from '../../models/product';
import { User, UserStore } from '../../models/user';
const request = supertest(app);
const userModel = new UserStore();
const productModel = new ProductStore();
let token = '';
describe('Products endpoint test suite', () => {
    const user: User = {
        username: 'test',
        password: 'test',
        first_name: 'test',
        last_name: 'test'
    };
    const p: Product = {
        name: 'Meat',
        price: 99.9,
        category: 'Food'
    };
    beforeAll(async () => {
        const newUser = await userModel.create(user);
        const newProduct = await productModel.create(p);
        p.id = newProduct.id;
        const response = await request
            .post('/users/login')
            .set('Content-type', 'application/json')
            .send({
                username: 'test',
                password: 'test'
            });
        token = response.body;
    });
    afterAll(async () => {
        const conn = await client.connect();
        const query = `DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART WITH 1;`;
        const result = await conn.query(query);
        conn.release();
        return result.rows;
    });

    it('should get products index endpoint', async () => {
        const response = await request.get('/products').set('Content-type', 'application/json');
        expect(response.status).toBe(200);

        expect(response.body[0].id).toEqual(p.id);
        expect(response.body[0].name).toEqual(p.name);
        expect(response.body[0].price).toEqual(p.price);
        expect(response.body[0].category).toEqual(p.category);
    });

    it('should create a product', async () => {
        const response = await request
            .post('/products/create')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'test1',
                price: 11,
                category: 'test1'
            });
        expect(response.status).toBe(200);
        expect(response.body.name).toEqual('test1');
        expect(response.body.price).toEqual(11);
        expect(response.body.category).toEqual('test1');
    });

    it('should show product', async () => {
        const response = await request
            .get(`/products/${p.id}`)
            .set('Content-type', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body.name).toEqual(p.name);
        expect(response.body.price).toEqual(p.price);
        expect(response.body.category).toEqual(p.category);
    });
    it('should show products by catergory', async () => {
        const response = await request
            .get(`/products/category/Food`)
            .set('Content-type', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body[0].name).toEqual(p.name);
        expect(response.body[0].price).toEqual(p.price);
        expect(response.body[0].category).toEqual(p.category);
        expect(response.body[0]).toEqual({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category
        });
    });
});
