const Customer = require("../models/customers");
const {
    uploadFile,
    removeTemporaryFile,
    deleteFromS3,
} = require("../tools/s3");
var authorizedMimeTypes = ["image/jpg", "image/jpeg", "image/png"];

async function createCustomer(req, res) {
    const customer = new Customer({
        name: req.body.name,
        surname: req.body.surname,
        photo: req.body.photo,
        createdBy: req.user._id,
    });
    const file = req.file;

    try {
        const savedCustomer = await customer.save();

        if (file && savedCustomer) {
            savedCustomer.photo = await uploadFile(
                file,
                savedCustomer._id.toString()
            );
            savedCustomer.save();
        }

        let populatedCostumer = await savedCustomer
            .populate("createdBy", "name surname")
            .execPopulate();

        res.send(populatedCostumer);
    } catch (err) {
        if (file) removeTemporaryFile(file);
        res.status(400).send(err.message);
    }
}

async function getAllCustomers(req, res) {
    try {
        let customers = await Customer.find()
            .populate("createdBy", "name surname")
            .populate("modifiedBy", "name surname");
        res.send(customers);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function getCustomerById(req, res) {
    try {
        let customer = await Customer.findById(req.params.id)
            .populate("createdBy", "name surname")
            .populate("modifiedBy", "name surname");
        if (customer) return res.send(customer);

        res.status(404).send("Customer not found");
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function editCustomer(req, res) {
    req.body.modifiedBy = req.user._id;
    const file = req.file;

    try {
        let customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { runValidators: true, new: true }
        );

        if (customer) {
            if (file) {
                customer.photo = await uploadFile(file, req.params.id);
                customer.save();
            }
            let populatedCostumer = await customer
                .populate("createdBy", "name surname")
                .populate("modifiedBy", "name surname")
                .execPopulate();
            return res.send(populatedCostumer);
        }

        res.status(404).send("Customer not found");
    } catch (err) {
        if (file) removeTemporaryFile(file);
        res.status(400).send(err.message);
    }
}

async function deleteCustomer(req, res) {
    try {
        let customer = await Customer.findByIdAndDelete(req.params.id);
        if (customer) {
            deleteFromS3(req.params.id);
            return res.send(customer);
        }
        res.status(404).send("Customer not found");
    } catch (err) {
        res.status(400).send(err.message);
    }
}

async function deletedUser(user) {
    await Customer.updateMany(
        { createdBy: user._id },
        { $set: { createdBy: { name: user.name, surname: user.surname } } },
        { runValidators: false, new: true }
    );
}

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    editCustomer,
    deleteCustomer,
    deletedUser,
};
