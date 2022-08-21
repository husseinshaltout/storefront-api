import supertest from 'supertest';
import app from '../../server';
import client from '../../database';
import { Order, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
import { Product, ProductStore } from '../../models/product';
import { OrderProducts, OrderProductsStore } from '../../models/orderProduct';
const request = supertest(app);
const userModel = new UserStore();
const orderModel = new OrderStore();
const productModel = new ProductStore();
const orderProductsModel = new OrderProductsStore();
let token = '';
describe('Orders endpoint test suite', () => {
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
    const order: Order = {
        user_id: '1',
        status: 'active'
    };
    // orderProducts object
    const orderP: OrderProducts = {
        order_id: '1',
        product_id: '1',
        quantity: 3
    };
    beforeAll(async () => {
        const newUser = await userModel.create(user);
        user.id = newUser.id;
        const newProduct = await productModel.create(p);
        p.id = newProduct.id;
        const newOrder = await orderModel.create(order);
        order.id = newOrder.id;
        // Set order and product id in OrderProduct object to the newly created order and product
        orderP.order_id = String(newOrder.id);
        orderP.product_id = String(newProduct.id);

        const newOrderProduct = await orderProductsModel.create(orderP);
        orderP.id = newOrderProduct.id;

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
        const query = `DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART WITH 1;DELETE FROM order_products; ALTER SEQUENCE order_products_id_seq RESTART WITH 1;`;
        const result = await conn.query(query);
        conn.release();
        return result.rows;
    });

    it('should get list of order products', async () => {
        const response = await request
            .get('/order_products')
            .set('Content-type', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body[0].id).toEqual(orderP.id);
        expect(response.body[0].order_id).toEqual(orderP.order_id);
        expect(response.body[0].product_id).toEqual(orderP.product_id);
        expect(response.body[0].quantity).toEqual(orderP.quantity);
    });

    it('should create an order product', async () => {
        const response = await request
            .post('/order_products/create')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                order_id: orderP.order_id,
                product_id: orderP.product_id,
                quantity: 12
            });
        expect(response.status).toBe(200);
        expect(response.body.order_id).toEqual(orderP.order_id);
        expect(response.body.product_id).toEqual(orderP.product_id);
        expect(response.body.quantity).toEqual(12);
    });
});
