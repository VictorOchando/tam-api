const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    if (!req.body.password) {
        return res.status(400).send("Password required");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        photo: req.body.photo,
    });

    try {
        let savedUser = await user.save();
        savedUser = savedUser.toObject();
        console.log(savedUser);
        delete savedUser.password;
        res.send(savedUser);
    } catch (err) {
        {
            res.status(400).send(err.message);
        }
    }
}

async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send("Wrong email ");
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

module.exports = { login, register };
