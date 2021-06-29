const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send("User doesn't exist");
        }

        const correctPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!correctPassword) {
            return res.status(400).send("Wrong password");
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );
        res.header("auth-token", token).send(token);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

module.exports = { login };
