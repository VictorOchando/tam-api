const User = require("../models/users");
const { deletedUser } = require("./customers");
const bcrypt = require("bcryptjs");
const {
    uploadFile,
    removeTemporaryFile,
    deleteFromS3,
} = require("../tools/s3");

async function createUser(req, res) {
    if (!req.body.password) {
        return res.status(400).send("Password required");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //MRIAR DE METER CON ...
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: hashedPassword,
        photo: req.body.photo,
    });
    const file = req.file;
    try {
        let savedUser = await user.save();

        if (file && savedUser) {
            savedUser.photo = await uploadFile(file, savedUser._id.toString());
            savedUser.save();
        }
        savedUser = savedUser.toObject();
        delete savedUser.password;
        res.send(savedUser);
    } catch (err) {
        if (file) removeTemporaryFile(file);
        res.status(400).send(err.message);
    }
}

async function getAllUsers(req, res) {
    try {
        let users = await User.find({}, { password: 0 });

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
    const file = req.file;
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashedPassword;
        }
        //RUN VALIDATORS
        let user = await User.findByIdAndUpdate(req.params.id, req.body, {
            runValidators: true,
            new: true,
            context: "query",
            projection: {
                password: 0,
            },
        });
        if (user) {
            if (file) {
                user.photo = await uploadFile(file, req.params.id);
            }
            user.save();
            user.toObject();
            delete user.password;
            return res.send(user);
        }

        res.status(404).send("User not found");
    } catch (err) {
        if (file) removeTemporaryFile(file);
        res.status(400).send(err.message);
    }
}

async function deleteUser(req, res) {
    try {
        let user = await User.findByIdAndDelete(req.params.id);
        //find customers createdby y cambiar por { name: user.name, surname: user.surname }
        //find customers modifiedby y cambiar por { name: user.name, surname: user.surname }

        if (user) {
            deletedUser(user);
            deleteFromS3(req.params.id);
            user.toObject();
            delete user.password;
            return res.send(user);
        }
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
