import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import jwt, { JwtPayload } from 'jsonwebtoken';
import verifyAuthToken from '../middleware/authTokenVerification';

const secret = process.env.TOKEN_SECRET as string;
const store = new OrderStore();

const index = async (req: Request, res: Response) => {
    try {
        const orders = await store.index();
        res.json(orders);
    } catch (err) {
        res.json(err);
    }
};

const show = async (req: Request, res: Response) => {
    try {
        const order = await store.show(parseInt(req.params.id));
        return res.json(order);
    } catch (err) {
        res.json(err);
    }
};

const create = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization?.split(' ')[1] as string;
    const decoded = jwt.verify(authHeader, secret) as JwtPayload;

    const order: Order = {
        user_id: decoded.user.id, // get user id from token
        status: req.body.status
    };
    try {
        const newOrder = await store.create(order);
        res.json(newOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const update = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization?.split(' ')[1] as string;
    const decoded = jwt.verify(authHeader, secret) as JwtPayload;
    const order: Order = {
        id: parseInt(req.params.id),
        user_id: decoded.user.id, // get user id from token
        status: req.body.status
    };
    try {
        const newOrder = await store.update(order);
        res.json(newOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const currentOrder = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization?.split(' ')[1] as string;
    const decoded = jwt.verify(authHeader, secret) as JwtPayload;
    const user_id = decoded.user.id; // get user id from token
    try {
        const cart = await store.currentOrder(user_id);
        res.json(cart);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const completedOrders = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization?.split(' ')[1] as string;
    const decoded = jwt.verify(authHeader, secret) as JwtPayload;
    const user_id = decoded.user.id; // get user id from token
    try {
        const completeOrder = await store.completedOrders(user_id);
        res.json(completeOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};
const orderDetails = async (req: Request, res: Response) => {
    try {
        const order = await store.orderDetails(parseInt(req.params.id));
        return res.json(order);
    } catch (err) {
        res.json(err);
    }
};
const orders_routes = (app: express.Application) => {
    app.get('/orders/cart', verifyAuthToken, currentOrder);
    app.get('/orders/complete', verifyAuthToken, completedOrders);
    app.get('/orders', index);
    app.get('/orders/:id', show);
    app.get('/orders/detailed/:id', orderDetails);
    app.post('/orders/create', verifyAuthToken, create);
    app.post('/orders/update/:id', verifyAuthToken, update);
};

export default orders_routes;
