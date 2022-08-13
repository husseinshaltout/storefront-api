import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import morgan from 'morgan';
import routes from './routes';

dotenv.config();

const PORT = process.env.PORT || 3000;
// create an instance server
const app: express.Application = express();
const address: string = '0.0.0.0:3000';

// HTTP request logger middleware
app.use(morgan('combined'));
app.use('/api', express.json(), routes);

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!');
});

app.listen(PORT, function () {
    console.log(`starting app on: ${address}`);
});

export default app;
