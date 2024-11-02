import express from 'express';
import Application from '../loaders/app';

import userRouter from './user/user.route';
import productRouter from './product/product.route';

type appRouter = { route: string; router: express.Router };

const appRouters: appRouter[] = [
    { route: '/users', router: userRouter.router },
    { route: '/products', router: productRouter.router }
];

const app = new Application();
app.setApiRouters(appRouters);

export default app;
