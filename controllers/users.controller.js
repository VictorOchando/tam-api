const User = require("../models/users.model");
const bcrypt = require("bcryptjs");

async function createUser(req, res) {
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
        const savedUser = await user.save();
        res.send({
            name: savedUser.name,
            surname: savedUser.surname,
            email: savedUser.email,
            _id: savedUser._id,
            photo: savedUser.photo,
            role: savedUser.role,
        });
    } catch (err) {
        {
            res.status(400).send(err.message);
        }
    }
}

async function getAllUsers(req, res) {
    try {
        let users = await User.find({}, { password: 0 });
        console.log(users);
        res.send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function getUserById(req, res) {
    try {
        let user = await User.findById(req.params.id, { password: 0 });
        if (user) return res.send(user);
        res.status(404).send("User not found");
    } catch (err) {
        res.status(400).send(err.message);
    }
}

async function editUser(req, res) {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;
        }
        let user = await User.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true,
            context: "query",
            projection: {
                password: 0,
            },
        });
        if (user) return res.send(user);
        res.status(404).send("User not found");
    } catch (err) {
        res.status(400).send(err.message);
    }
}

async function deleteUser(req, res) {
    try {
        let user = await User.findByIdAndDelete(req.params.id);
        if (user) return res.send(user);
        res.status(404).send("User not found");
    } catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    editUser,
    deleteUser,
};
