import { Pool } from 'pg';
import DBLoaderInstance, { DBLoader } from '../../loaders/database';
import { Product } from './interface/product.interface';

class ProductRepository {
    private dbLoader: DBLoader;
    private client: Pool;

    constructor() {
        this.dbLoader = DBLoaderInstance;
        this.client = this.dbLoader.getClient();
    }

    async getAll(): Promise<Product[]> {
        try {
            const query = `SELECT * FROM products`;
            const result = await this.client.query(query);

            return result.rows;
        } catch (error) {
            throw new Error(`Cannot get products ${error}`);
        }
    }

    async getProductById(id: number): Promise<Product> {
        try {
            const query = `SELECT * FROM products WHERE id='${id}'`;
            const result = await this.client.query(query);

            return result.rows[0];
        } catch (error) {
            throw new Error(`Cannot get product with id = ${id}. Error: ${error}`);
        }
    }

    async create(product: Product): Promise<Product> {
        try {
            const query = `INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *`;

            const result = await this.client.query(query, [
                product.name,
                product.price,
                product.category
            ]);

            return result.rows[0];
        } catch (error) {
            console.error(error);
            throw new Error(`Cannot create product: ${error}`);
        }
    }

    async showByCategory(category: string): Promise<Product[]> {
        try {
            const query = `SELECT * FROM products where category='${category}'`;
            const result = await this.client.query(query);
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get products with category = ${category}. Error: ${err}`);
        }
    }
}

const productRepository = new ProductRepository();
export default productRepository;
