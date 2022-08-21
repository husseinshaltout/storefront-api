import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import verifyAuthToken from '../middleware/authTokenVerification';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
    try {
        const products = await store.index();
        res.json(products);
    } catch (err) {
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(req.params.id);
        return res.json(product);
    } catch (err) {
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const product: Product = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };
    try {
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const showByCategory = async (req: Request, res: Response) => {
    try {
        const products = await store.showByCategory(req.params.category);
        console.log(req.params.category);

        return res.json(products);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const products_routes = (app: express.Application) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products/create', verifyAuthToken, create);
    app.get('/products/category/:category', showByCategory);
};

export default products_routes;
