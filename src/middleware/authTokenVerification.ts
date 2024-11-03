import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export type TokenPayload = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
};

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization as string;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401);
            res.json('Authorization header missing or malformed');
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, config.AUTH.SECRET) as TokenPayload;

        req.user = decoded;

        next();
    } catch (err) {
        res.status(401);
        res.json(`An error occurred: ${err}`);
        return;
    }
};

export default verifyAuthToken;
