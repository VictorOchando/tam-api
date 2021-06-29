const jwt = require("jsonwebtoken");

function isLogged(req, res, next) {
    const token = req.header("auth-token");
    if (!token) return res.status(401).send("Unauthorized");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        next();
    } catch (err) {
        res.status(400).send("Invalid Token");
    }
}

function isAdmin(req, res, next) {
    if (req.user.role == "admin") {
        next();
    } else {
        res.status(403).send("Forbidden");
    }
}

module.exports = { isLogged, isAdmin };
