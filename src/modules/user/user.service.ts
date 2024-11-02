import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { User } from './interface/user.interface';
import userRepository from './user.repository';

class UserService {
    async getAllUsers() {
        try {
            return await userRepository.getAll();
        } catch (error) {
            throw new Error(`Unable to get all users: ${error}`);
        }
    }

    async getUserById(id: number) {
        try {
            return await userRepository.getUserById(id);
        } catch (error) {
            throw new Error(`Unable to get user with id ${id}: ${error}`);
        }
    }

    private signToken(user: User) {
        const tokenPayload = {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name
        };
        return jwt.sign({ user: tokenPayload }, config.AUTH.SECRET);
    }

    async create(user: User) {
        try {
            const hash = bcrypt.hashSync(
                user.password + config.AUTH.PEPPER,
                parseInt(config.AUTH.SALT_ROUNDS)
            );

            const newUserPayload: User = {
                username: user.username,
                password: hash,
                first_name: user.first_name,
                last_name: user.last_name
            };

            const newUser = await userRepository.create(newUserPayload);

            const accessToken = this.signToken(newUser);

            return {
                username: newUser.username,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                accessToken
            };
        } catch (error) {
            throw new Error(`Unable to create user: ${error}`);
        }
    }

    async login(username: string, password: string) {
        try {
            const user = await this.authenticate(username, password);

            if (!user) return null;

            return this.signToken(user);
        } catch (error) {
            throw new Error(`Unable to login user: ${error}`);
        }
    }

    async authenticate(username: string, password: string) {
        try {
            const user = await userRepository.findOneByUsername(username);

            if (!user) return null;

            if (bcrypt.compareSync(password + config.AUTH.PEPPER, user.password)) return user;

            return null;
        } catch (error) {
            throw new Error(`Unable to authenticate user: ${error}`);
        }
    }
}

const userService = new UserService();
export default userService;
