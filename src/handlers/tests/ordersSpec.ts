import supertest from 'supertest';
import app from '../../server';
import client from '../../database';
import { Order, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
const request = supertest(app);
const userModel = new UserStore();
const orderModel = new OrderStore();
let token = '';
describe('Orders endpoint test suite', () => {
    const user: User = {
        username: 'test',
        password: 'test',
        first_name: 'test',
        last_name: 'test'
    };
    const order: Order = {
        user_id: '1',
        status: 'active'
    };
    beforeAll(async () => {
        const newUser = await userModel.create(user);
        user.id = newUser.id;

        const neworder = await orderModel.create(order);
        order.id = neworder.id;
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
        const query = `DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;`;
        const result = await conn.query(query);
        conn.release();
        return result.rows;
    });

    it('should get list of orders', async () => {
        const response = await request.get('/orders').set('Content-type', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body[0].id).toEqual(order.id);
        expect(response.body[0].user_id).toEqual(order.user_id);
        expect(response.body[0].status).toEqual(order.status);
    });

    it('should create an order', async () => {
        const response = await request
            .post('/orders/create')
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                user_id: order.user_id,
                status: 'active'
            });
        expect(response.status).toBe(200);
        expect(response.body.user_id).toEqual(order.user_id);
        expect(response.body.status).toEqual('active');
    });

    it('should show order', async () => {
        const response = await request
            .get(`/orders/${order.id}`)
            .set('Content-type', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body.user_id).toEqual(order.user_id);
        expect(response.body.status).toEqual(order.status);
    });
    it('should show current order', async () => {
        const response = await request
            .get(`/orders/cart`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        // expect(response.body[0].name).toEqual(order.name);
        expect(response.body).toEqual({
            id: order.id,
            user_id: order.user_id,
            status: 'active'
        });
    });
    it('should update an order', async () => {
        const response = await request
            .post(`/orders/update/${order.id}`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({
                status: 'complete'
            });
        expect(response.status).toBe(200);
        expect(response.body.user_id).toEqual(order.user_id);
        expect(response.body.status).toEqual('complete');
    });
    it('should show complete order', async () => {
        const response = await request
            .get(`/orders/complete`)
            .set('Content-type', 'application/json')
            .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        // expect(response.body[0].name).toEqual(order.name);
        expect(response.body[0]).toEqual({
            id: order.id,
            user_id: order.user_id,
            status: 'complete'
        });
    });
});
