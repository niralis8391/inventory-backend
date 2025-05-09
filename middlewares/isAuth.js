const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        req.isAuth = false;
        return next();
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decode.userId;
        req.isAuth = true;
    } catch (error) {
        req.isAuth = false
    }
    next();

}

module.exports = auth;