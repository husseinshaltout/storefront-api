import client from '../database';

export type OrderProducts = {
    id?: number;
    order_id: string;
    product_id: string;
    quantity: number;
};

export class OrderProductsStore {
    async index(): Promise<OrderProducts[]> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM order_products`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get order products ${err}`);
        }
    }

    async show(id: string): Promise<OrderProducts> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM order_products WHERE id='${id}';`;
            const result = await conn.query(query);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot get order products with id = ${id}. Error: ${err}`);
        }
    }

    async create(order: OrderProducts): Promise<OrderProducts> {
        try {
            const conn = await client.connect();
            const query =
                'INSERT INTO order_products (order_id , product_id,  quantity) VALUES($1, $2, $3) RETURNING *;';
            const result = await conn.query(query, [
                order.order_id,
                order.product_id,
                order.quantity
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot create order products.: ${err}`);
        }
    }
}
