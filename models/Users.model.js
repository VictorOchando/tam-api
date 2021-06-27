const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [1, "Name too short"],
        maxlength: [60, "Name too long"],
        lowercase: true,
        trim: true,
        match: [/^[a-z ,.'-]+$/i, "Name contains invalid characters"],
    },
    surname: {
        type: String,
        required: [true, "Surname is required"],
        minlength: [1, "Surname too short"],
        maxlength: [60, "Surname too long"],
        lowercase: true,
        trim: true,
        match: [/^[a-z ,.'-]+$/i, "Surname contains invalid characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        minlength: [1, "Email too short"],
        maxlength: [100, "Email too long"],
        lowercase: true,
        match: [/^.+@(?:[\w-]+\.)+\w+$/, "Invalid email"],
        index: true,
        trim: true,
    },
    photo: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: [200, "Photo url too long"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    role: {
        type: String,
        trim: true,
        default: "user",
        enum: {
            values: ["user", "admin"],
            message: "Role doesn't exist",
        },
    },
});

//compound index for better performance
userSchema.index({ name: 1, surname: 1 });
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
