import User from '../models/user.mjs';
import { validate as uuidValidate, v4 as uuidv4 } from 'uuid';

export default class UserController {
    async createUser() {
        return await User.create({ id: uuidv4() });
    }

    async readUser(id) {
        const user = await User.findOne({ id: id }).lean();

        if (!user)
            return null;

        const { password: _, ...rest } = user;
        return rest;
    }

    async updateUser(user) {
        if (!user.id || !uuidValidate(user.id))
            return;

        const updatedUser = await User.findOneAndUpdate({ id: user.id }, {
            email: user.email,
            password: user.password
        }, { new: true }).lean();

        const { password: _, ...rest } = updatedUser;
        return rest;
    }

    async authenticateUser(email, password) {
        const user = await User.findOne({ email: email }).lean();

        if (!user || !user.password)
            return null;

        if (user.password === password) {
            const { password: _, ...rest } = user;
            return rest;
        }

        return null;
    }
}
