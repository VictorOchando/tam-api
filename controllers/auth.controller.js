const router = require("express").Router();
const Customer = require("../models/Customers.model");
const User = require("../models/Users.model");
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
        role: req.body.role,
        photo: req.body.photo,
    });

    try {
        const savedUser = await user.save();
        res.send({
            name: savedUser.name,
            surname: savedUser.surname,
            email: savedUser.email,
            _id: savedUser._id,
            role: savedUser.role,
            photo: savedUser.photo,
        });
    } catch (err) {
        {
            res.status(400).send(err);
        }
    }
}

async function login(req, res) {
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
}

module.exports = { login, register };
