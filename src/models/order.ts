import client from '../database';

export type Order = {
    id?: number;
    user_id: string;
    status: string;
};

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM orders`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get orders ${err}`);
        }
    }

    async show(id: number): Promise<Order> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM orders WHERE id='${id}'`;
            const result = await conn.query(query);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot get order with id = ${id}. Error: ${err}`);
        }
    }

    async create(order: Order): Promise<Order> {
        try {
            const conn = await client.connect();
            const query = `INSERT INTO orders (user_id,status) VALUES ($1, $2) RETURNING *`;
            const result = await conn.query(query, [order.user_id, order.status]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot create order: ${err}`);
        }
    }
    // update order to complete
    async update(order: Order): Promise<Order> {
        try {
            const conn = await client.connect();
            const query = `UPDATE orders SET status = ($1) WHERE id = ${order.id} RETURNING *`;
            const result = await conn.query(query, [order.status]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot update order: ${err}`);
        }
    }
    // current order by user
    async currentOrder(user_id: string): Promise<Order> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM orders WHERE user_id=($1) and status = 'active';`;
            const result = await conn.query(query, [user_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot update order: ${err}`);
        }
    }
    // current order by user
    async completedOrders(user_id: string): Promise<Order> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM orders WHERE user_id=($1) and status = 'complete';`;
            const result = await conn.query(query, [user_id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot update order: ${err}`);
        }
    }

    async order(id: number): Promise<Order> {
        try {
            const conn = await client.connect();
            const query = `SELECT order_products.id, name, price, order_products.quantity  FROM products INNER JOIN order_products ON products.id=order_products.product_id where order_products.order_id=($1);`;
            const result = await conn.query(query, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot update order: ${err}`);
        }
    }
}
