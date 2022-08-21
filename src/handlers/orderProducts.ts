import express, { Request, Response } from 'express';
import { OrderProducts, OrderProductsStore } from '../models/orderProduct';
import verifyAuthToken from '../middleware/authTokenVerification';

const store = new OrderProductsStore();

const index = async (req: Request, res: Response) => {
    try {
        const orderProducts = await store.index();
        res.json(orderProducts);
    } catch (err) {
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const orderProducts = await store.show(req.params.id);
        return res.json(orderProducts);
    } catch (err) {
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const orderProducts: OrderProducts = {
        order_id: req.body.order_id,
        product_id: req.body.product_id,
        quantity: parseInt(req.body.quantity)
    };
    try {
        const newOrderProducts = await store.create(orderProducts);
        res.json(newOrderProducts);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const orderProducts_routes = (app: express.Application) => {
    app.get('/order_products', index);
    app.get('/order_products/:id', show);
    app.post('/order_products/create', verifyAuthToken, create);
};

export default orderProducts_routes;
