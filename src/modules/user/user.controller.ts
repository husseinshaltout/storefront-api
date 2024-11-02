import { Request, Response } from 'express';
import { User } from './interface/user.interface';
import userService from './user.service';

class UserController {
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            throw new Error(`Unable to get all users: ${error}`);
        }
    }

    async getUserById(req: Request, res: Response) {
        const userId = parseInt(req.params.id, 10);
        try {
            const user = await userService.getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json(error);
        }
    }

    async create(req: Request, res: Response) {
        const user: User = {
            username: req.body?.username,
            password: req.body?.password,
            first_name: req.body?.first_name,
            last_name: req.body?.last_name
        };

        try {
            const newUser = await userService.create(user);
            res.status(200).json(newUser);
        } catch (error) {
            res.status(400).json(error);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const userAuth = await userService.login(req.body.username, req.body.password);

            if (userAuth) {
                res.status(200).json(userAuth);
            } else {
                res.status(401).json(userAuth);
            }
        } catch (error) {
            res.status(401).json(error);
        }
    }
}

const userController = new UserController();

export default userController;