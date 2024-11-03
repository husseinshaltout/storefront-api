import { Pool } from 'pg';
import DBLoaderInstance, { DBLoader } from '../../loaders/database';
import { Order } from './interface/order.interface';

class OrderRepository {
    private dbLoader: DBLoader;
    private client: Pool;

    constructor() {
        this.dbLoader = DBLoaderInstance;
        this.client = this.dbLoader.getClient();
    }

    async getAll(): Promise<Order[]> {
        try {
            const query = `SELECT * FROM orders`;
            const result = await this.client.query(query);

            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get orders ${error}`);
        }
    }

    async getOrderById(id: number): Promise<Order> {
        try {
            const query = `SELECT * FROM orders WHERE id='${id}'`;
            const result = await this.client.query(query);

            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot get order with id = ${id}. Error: ${error}`);
        }
    }

    async create(order: Order): Promise<Order> {
        try {
            const query = `INSERT INTO orders (user_id,status) VALUES ($1, $2) RETURNING *`;
            const result = await this.client.query(query, [order.user_id, order.status]);

            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot create order: ${error}`);
        }
    }

    async update(order: Order): Promise<Order> {
        try {
            const query = `UPDATE orders SET status = ($1) WHERE id = ${order.id} RETURNING *`;
            const result = await this.client.query(query, [order.status]);
            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot update order: ${error}`);
        }
    }

    async currentOrder(user_id: string): Promise<Order> {
        try {
            const query = `SELECT * FROM orders WHERE user_id=($1) and status = 'active';`;
            const result = await this.client.query(query, [user_id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot get current order: ${error}`);
        }
    }

    async completedOrders(user_id: string): Promise<Order[]> {
        try {
            const query = `SELECT * FROM orders WHERE user_id=($1) and status = 'complete';`;
            const result = await this.client.query(query, [user_id]);
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get completed orders: ${error}`);
        }
    }

    async orderDetails(id: number): Promise<Order[]> {
        try {
            const query = `SELECT order_products.id, name, price, order_products.quantity  FROM products INNER JOIN order_products ON products.id=order_products.product_id where order_products.order_id=($1);`;
            const result = await this.client.query(query, [id]);
            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get order details: ${error}`);
        }
    }
}

const orderRepository = new OrderRepository();
export default orderRepository;
