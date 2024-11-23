import jwt from 'jsonwebtoken';

export const secret = 'open-secret-123';

export const handleInvalidCredentials = (req, res) => {
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

export const verifyJwt = (authorization) => {
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
