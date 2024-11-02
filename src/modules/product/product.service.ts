import { Product } from './interface/product.interface';
import productRepository from './product.repository';

class ProductService {
    async getAllProducts() {
        try {
            return await productRepository.getAll();
        } catch (error) {
            throw new Error(`Unable to get all products: ${error}`);
        }
    }

    async getProductById(id: number) {
        try {
            return await productRepository.getProductById(id);
        } catch (error) {
            throw new Error(`Unable to get product with id ${id}: ${error}`);
        }
    }

    async create(product: Product) {
        try {
            const newProduct = await productRepository.create(product);

            return newProduct;
        } catch (error) {
            throw new Error(`Unable to create product: ${error}`);
        }
    }
    async showByCategory(category: string) {
        try {
            const products = await productRepository.showByCategory(category);
            return products;
        } catch (error) {
            throw new Error(`Unable to get products with category ${category}: ${error}`);
        }
    }
}

const productService = new ProductService();
export default productService;
