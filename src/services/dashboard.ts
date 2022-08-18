import Client from '../database';

export class DashboardQueries {
    // Get all products that have been included in orders
    async topProducts(): Promise<{ name: string; price: number }[]> {
        try {
            //@ts-ignore
            const conn = await Client.connect();
            const sql =
                'SELECT name, COUNT(products.id) FROM products INNER JOIN order_products ON product_id=order_products.product_id GROUP BY products.name ORDER BY count ASC LIMIT 5;';

            const result = await conn.query(sql);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`unable get top 5 products: ${err}`);
        }
    }
}
