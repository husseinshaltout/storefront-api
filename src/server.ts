import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import user_routes from './handlers/users';
import products_routes from './handlers/products';
import orders_routes from './handlers/orders';
import orderProducts_routes from './handlers/orderProducts';
dotenv.config();

const PORT = process.env.PORT || 3000;
// create an instance server
const app: express.Application = express();
const address = '0.0.0.0:3000';
const corsConfig = {
    origin: 'somesite.com',
    optionalSuccessStatus: 200
};
// HTTP request logger middleware
app.use(morgan('combined'));

app.use(cors(corsConfig));
app.use(bodyParser.json());
user_routes(app);
products_routes(app);
orders_routes(app);
orderProducts_routes(app);
// app.get('/', function (req: Request, res: Response) {
//     res.send('Hello World!');
// });

app.listen(PORT, function () {
    console.log(`starting app on: ${address}`);
});

export default app;
