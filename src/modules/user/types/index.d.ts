declare namespace Express {
    export interface Request {
        user?: {
            id: number;
            username: string;
            first_name: string;
            last_name: string;
        };
    }
}
