const router = require("express").Router();
const { isLogged } = require("../middlewares/auth.guard");
const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    editCustomer,
    deleteCustomer,
} = require("../controllers/customers.controller");

router.get("/", isLogged, getAllCustomers);
router.get("/:id", isLogged, getCustomerById);
router.post("/", isLogged, createCustomer);
router.patch("/:id", isLogged, editCustomer);
router.delete("/:id", isLogged, deleteCustomer);

module.exports = router;
