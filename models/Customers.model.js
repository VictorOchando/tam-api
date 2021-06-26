const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: [1, "Name too short"],
        maxlength: [60, "Name too long"],
        lowercase: true,
        match: [/^[a-z ,.'-]+$/i, "Name contains invalid characters"],
        //index: true,
    },
    surname: {
        type: String,
        required: [true, "Surname is required"],
        minlength: [1, "Surname too short"],
        maxlength: [60, "Surname too long"],
        lowercase: true,
        match: [/^[a-z ,.'-]+$/i, "Surname contains invalid characters"],
        //index: true,
    },
    photo: {
        type: String,
        required: false,
        minlength: 1,
        maxlength: [200, "Photo url too long"],
    },
    // createdBy: {
    //     type: mongoose.Types.ObjectId,
    //     required: true,
    // },
    // modifiedBy: {
    //     type: mongoose.Types.ObjectId,
    //     required: false,
    // },
});
//compound index for better performance
customerSchema.index({ name: 1, surname: 1 });

module.exports = mongoose.model("Customer", customerSchema);
