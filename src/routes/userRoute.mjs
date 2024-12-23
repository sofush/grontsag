import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import UserController from '../controllers/userController.mjs';
import { verifyJwt, handleInvalidCredentials, secret } from '../util/auth.mjs';

const userValidator = Joi.object({
    email: Joi
        .string()
        .min(1),

    password: Joi
        .string()
        .min(1),
});

class UserRoute {
    constructor() {
        this.userController = new UserController();
    }

    setupRouter() {
        const router = express.Router();

        router.use(express.json());

        router.get('/api/user', async (req, res) => {
            const authorization = req.headers.authorization;

            if (!authorization)
                return handleInvalidCredentials(req, res);

            const user = verifyJwt(req.headers.authorization);

            if (!user)
                return handleInvalidCredentials(req, res);

            const upToDateUser = await this.userController.readUser(user.id);
            res.status(200).json(upToDateUser);
        });

        router.get('/api/user/new', async (_req, res) => {
            const user = await this.userController.createUser();
            const token = jwt.sign(user.toJSON(), secret);
            res.status(200).json({ jwt: token });
        });

        router.patch('/api/user', async (req, res) => {
            const authUser = verifyJwt(req.headers.authorization);

            if (!authUser)
                return handleInvalidCredentials(req, res);

            const { error, value: userUpdate } = userValidator.validate(req.body);

            if (error) {
                res.status(400).json({ error: 'Invalid input' });
                return;
            }

            userUpdate.id = authUser.id;

            try {
                const updatedUser = await this.userController.updateUser(userUpdate);
                const token = jwt.sign(JSON.stringify(updatedUser), secret);
                res.status(200).json({ jwt: token, user: updatedUser });
            } catch (e) {
                console.error(e);
                res.status(400).json({ error: 'Duplicate email' });
                return;
            }
        });

        router.post('/api/login', async (req, res) => {
            const { error, value: cred } = userValidator.validate(req.body);

            if (error) {
                res.status(400).json({ error: 'Invalid input', reason: 'input' });
                return;
            }

            const user = await this.userController.authenticateUser(cred.email, cred.password);

            if (!user) {
                res.status(400).json({ error: 'Incorrect credentials', reason: 'credentials' });
                return;
            }

            const token = jwt.sign(JSON.stringify(user), secret);
            res.status(200).json({ jwt: token });
        });

        router.get('/login', (_req, res) => {
            res.sendFile('login.html', { root: 'dist' });
        });

        router.get('/register', (_req, res) => {
            res.sendFile('register.html', { root: 'dist' });
        });

        return router;
    }
}

export default UserRoute;