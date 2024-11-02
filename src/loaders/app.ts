import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import config from '../config';

type appRouter = { route: string; router: express.Router };

export default class Application {
    app;
    apiRouters: appRouter[] = [];
    server: http.Server | null = null;

    constructor() {
        this.app = express();
    }
    setApiRouters(apiRouters: appRouter[]) {
        this.apiRouters = apiRouters;
    }

    private useApiRoute(route: string, router: express.Router) {
        this.app.use(`${route}`, router);
        return this;
    }

    // Adding all router in list
    useApiRouters() {
        this.apiRouters.forEach((router) => {
            this.useApiRoute(`/api${router.route}`, router.router);
        });
        return this;
    }

    // Add Unknown Route Handling
    redirectToNotFound() {
        this.app.all('*', (req, res) => {
            res.status(404).json({ message: `Route not found: ${req.url}` });
        });
        return this;
    }

    enableLogger() {
        this.app.use(morgan('combined'));
        return this;
    }

    enableCors() {
        this.app.use(cors(config.CORS));
        return this;
    }

    enableBodyParser() {
        this.app.use(bodyParser.json());
        return this;
    }

    startServer(port: number) {
        this.server = this.app.listen(port, function () {
            console.log(`Server is up & listening on port: ${port}`);
        });
        return this;
    }

    closeServer() {
        this.server?.close();
        return this;
    }
}
