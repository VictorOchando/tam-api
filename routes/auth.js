const router = require("express").Router();
const Customer = require("../models/Customers.model");
const User = require("../models/Users.model");

router.post("/register", async (req, res) => {
    const user = new User({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
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
});

module.exports = router;
