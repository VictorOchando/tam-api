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
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            }
        );
        res.header("auth-token", token).send(token);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function register(req, res) {
    if (req.body.registerPassword != process.env.REGISTER_PASSWORD)
        return res.status(400).send("Invalid register password");

    if (!req.body.password) return res.status(400).send("Password is needed");

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
        savedUser.toObject();
        delete savedUser.password;
        res.send(savedUser);
    } catch (err) {
        {
            res.status(400).send(err);
        }
    }
}

module.exports = { login, register };
