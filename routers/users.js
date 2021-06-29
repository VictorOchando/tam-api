const router = require("express").Router();
const { isLogged, isAdmin } = require("../middlewares/auth");
const {
    createUser,
    getAllUsers,
    getUserById,
    editUser,
    deleteUser,
} = require("../controllers/users");

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

router.get("/", isLogged, isAdmin, getAllUsers);
router.get("/:id", isLogged, isAdmin, getUserById);
router.post("/", isLogged, isAdmin, upload, createUser);
router.patch("/:id", isLogged, isAdmin, upload, editUser);
router.delete("/:id", isLogged, isAdmin, deleteUser);

module.exports = router;
