import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET as string;
// Reference : https://github.com/omargaber/ndjs-examples/blob/master/april_22/w6/src/middleware/global.ts
const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization as string;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401);
            res.json('Authorization header missing or malformed');
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, secret);
        next();
    } catch (err) {
        res.status(401);
        res.json(`An error occurred: ${err}`);
        return;
    }
};

export default verifyAuthToken;
