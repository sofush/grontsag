import express from 'express';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import UserController from '../controllers/userController.mjs';

const secret = 'open-secret-123';
const userValidator = Joi.object({
    email: Joi
        .string()
        .min(1),

    password: Joi
        .string()
        .min(1),
});

const handleInvalidCredentials = (req, res) => {
    if (req.accepts('json')) {
        res
            .status(403)
            .json({
                error: 'Invalid or missing credentials'
            });
        return;
    }

    res.redirect('/login');
};

const verifyJwt = (authorization) => {
    if (!authorization)
        return null;

    try {
        console.log(`Verifying authorization: ${authorization}`);
        return jwt.verify(authorization, secret);
    } catch (err) {
        console.log(err);
    }

    return null;
};

class UserRoute {
    constructor() {
        this.userController = new UserController();
    }

    setupMiddleware() {
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
            const updatedUser = await this.userController.updateUser(userUpdate);
            const token = jwt.sign(JSON.stringify(updatedUser), secret);
            res.status(200).json({ jwt: token, user: updatedUser });
        });

        router.get('/api/login', async (req, res) => {
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