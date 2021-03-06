const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [1, "Name too short"],
        maxlength: [60, "Name too long"],
        lowercase: true,
        index: true,
        match: [/^[a-z ,.'-]+$/i, "Name contains invalid characters"],
        trim: true,
    },
    surname: {
        type: String,
        required: [true, "Surname is required"],
        minlength: [1, "Surname too short"],
        maxlength: [60, "Surname too long"],
        lowercase: true,
        index: true,
        match: [/^[a-z ,.'-]+$/i, "Surname contains invalid characters"],
        trim: true,
    },
    photo: {
        type: String,
        required: false,
        maxlength: [250, "Photo url too long"],
        trim: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.Mixed,
        ref: "User",
        required: true,
    },
    modifiedBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: false,
    },
});

module.exports = mongoose.model("Customer", customerSchema);
