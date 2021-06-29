const router = require("express").Router();
const { isLogged } = require("../middlewares/auth");
const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    editCustomer,
    deleteCustomer,
} = require("../controllers/customers");

const authorizedMimeTypes = ["image/jpg", "image/jpeg", "image/png"];
const multer = require("multer");
const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 500000,
    },
    fileFilter: (req, file, cb) => {
        if (!authorizedMimeTypes.includes(file.mimetype)) {
            return cb(new Error("Wrong format"));
        }
        cb(null, true);
    },
}).single("photo");

router.get("/", isLogged, getAllCustomers);
router.get("/:id", isLogged, getCustomerById);
router.post("/", isLogged, upload, createCustomer);
router.patch("/:id", isLogged, upload, editCustomer);
router.delete("/:id", isLogged, deleteCustomer);

module.exports = router;
