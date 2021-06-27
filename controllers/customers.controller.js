const Customer = require("../models/customers.model");

async function createCustomer(req, res) {
    const customer = new Customer({
        name: req.body.name,
        surname: req.body.surname,
        photo: req.body.photo,
        createdBy: req.user._id,
    });

    try {
        const savedCustomer = await customer.save();
        res.send(savedCustomer.populate("createdBy"));
    } catch (err) {
        res.status(400).send(err);
    }
}

async function getAllCustomers(req, res) {
    try {
        let customers = await Customer.find()
            .populate("createdBy")
            .populate("modifiedBy");
        res.send(customers);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

async function getCustomerById(req, res) {
    try {
        let customer = await Customer.findById(req.params.id);
        if (customer) res.send(customer);

        res.status(404).send("Customer not found");
    } catch (err) {
        res.status(400).send(err.message);
    }
}

async function editCustomer(req, res) {
    try {
        req.body.modifiedBy = req.user._id;
        let customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { runValidators: true, new: true }
        );
        if (customer) return res.send(customer);
        res.status(404).send("Customer not found");
    } catch (err) {
        res.status(400).send(err.message);
    }
}

async function deleteCustomer(req, res) {
    try {
        console.log("dentro");
        let customer = await Customer.findByIdAndDelete(req.params.id);
        if (customer) return res.send(customer);
        res.status(404).send("Customer not found");
    } catch (err) {
        res.status(400).send(err.message);
    }
}

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    editCustomer,
    deleteCustomer,
};
