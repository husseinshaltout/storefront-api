import { Request, Response } from 'express';
import { Product } from './interface/product.interface';
import productService from './product.service';

class ProductController {
    async getAllProducts(req: Request, res: Response) {
        try {
            const products = await productService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            throw new Error(`Unable to get all products: ${error}`);
        }
    }

    async getProductById(req: Request, res: Response) {
        const productId = parseInt(req.params.id, 10);
        try {
            const product = await productService.getProductById(productId);
            res.status(200).json(product);
        } catch (error) {
            console.error(error);
            res.status(404).json(error);
        }
    }

    async create(req: Request, res: Response) {
        const product: Product = {
            name: req.body?.name,
            price: req.body?.price,
            category: req.body?.category
        };

        try {
            const newProduct = await productService.create(product);
            res.status(200).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(400);
            res.json(error);
        }
    }

    async showByCategory(req: Request, res: Response) {
        const category = req.params.category;
        try {
            const products = await productService.showByCategory(category);
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(400);
            res.json(error);
        }
    }
}

const productController = new ProductController();

export default productController;
