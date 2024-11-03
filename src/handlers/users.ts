import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import verifyAuthToken from '../common/middleware/authTokenVerification';

const secret = process.env.TOKEN_SECRET as string;
const store = new UserStore();

const index = async (req: Request, res: Response) => {
    const users = await store.index();
    res.json(users);
};

const show = async (req: Request, res: Response) => {
    const user_id = parseInt(req.params.id);
    try {
        const authHeader = req.headers.authorization?.split(' ')[1] as string;
        const decoded = jwt.verify(authHeader, secret) as JwtPayload;

        if (decoded.user.id !== user_id) {
            res.json('User ID mismatch with token');
            return;
        } else {
            const user = await store.show(req.params.id);
            res.json(user);
            return;
        }
    } catch (err) {
        res.json(err);
    }

    const user = await store.show(req.params.id);
    res.json(user);
};

const create = async (req: Request, res: Response) => {
    const user: User = {
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name
    };
    try {
        const newUser = await store.create(user);
        const tokenPayload = {
            id: newUser.id,
            username: newUser.username,
            first_name: newUser.first_name,
            last_name: newUser.last_name
        };
        // Creating tokens and returning it to the client side
        const token = jwt.sign({ user: tokenPayload }, secret);
        res.json(token);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const login = async (req: Request, res: Response) => {
    try {
        const userAuth = await store.authenticate(req.body.username, req.body.password);
        const tokenPayload = {
            id: userAuth?.id,
            username: userAuth?.username,
            first_name: userAuth?.first_name,
            last_name: userAuth?.last_name
        };
        if (userAuth) {
            const token = jwt.sign({ user: tokenPayload }, secret);
            res.json(token);
        } else {
            res.status(401);
            res.json(userAuth);
        }
    } catch (err) {
        res.json(err);
    }
};

const user_routes = (app: express.Application) => {
    app.get('/users', verifyAuthToken, index);
    app.get('/users/show/:id', show);
    app.post('/users/create', create);
    app.post('/users/login', login);
};

export default user_routes;
