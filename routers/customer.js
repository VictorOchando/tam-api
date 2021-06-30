const router = require("express").Router();
const { isLogged } = require("../middlewares/auth");
const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    editCustomer,
    deleteCustomer,
} = require("../controllers/customers");
const { upload } = require("../middlewares/multer");

router.get("/", isLogged, getAllCustomers);
router.get("/:id", isLogged, getCustomerById);
router.post("/", isLogged, upload, createCustomer);
router.patch("/:id", isLogged, upload, editCustomer);
router.delete("/:id", isLogged, deleteCustomer);

module.exports = router;
