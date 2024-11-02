import express from 'express';
import userRouter from './user/user.route';
import Application from '../loaders/app';

type appRouter = { route: string; router: express.Router };

const appRouters: appRouter[] = [{ route: '/users', router: userRouter.router }];

const app = new Application();
app.setApiRouters(appRouters);

export default app;
