import client from '../database';

export type Product = {
    id?: number;
    name: string;
    price: number;
    category?: string;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM products`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get products ${err}`);
        }
    }

    async show(id: string): Promise<Product> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM products WHERE id='${id}'`;
            const result = await conn.query(query);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot get product with id = ${id}. Error: ${err}`);
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            const conn = await client.connect();
            const query =
                'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(query, [product.name, product.price, product.category]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot create product.: ${err}`);
        }
    }

    async showByCategory(category: string): Promise<Product[]> {
        try {
            const conn = await client.connect();
            const query = `SELECT * FROM products where category='${category}'`;
            const result = await conn.query(query);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get products with category = ${category}. Error: ${err}`);
        }
    }
}
