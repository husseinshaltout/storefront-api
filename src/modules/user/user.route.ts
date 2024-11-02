import { Router } from 'express';
import verifyAuthToken from '../../middleware/authTokenVerification';
import userController from './user.controller';

class UserRouter {
    public router = Router();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('', verifyAuthToken, userController.getAllUsers.bind(userController));
        this.router.get(':id', userController.getUserById.bind(userController));
        this.router.post('', userController.create.bind(userController));
        this.router.post('/login', userController.login.bind(userController));
    }
}

const userRouter = new UserRouter();
export default userRouter;
