const router = require("express").Router();
const { isLogged, isAdmin } = require("../middlewares/auth");
const {
    createUser,
    getAllUsers,
    getUserById,
    editUser,
    deleteUser,
} = require("../controllers/users");
const { upload } = require("../middlewares/multer");

router.get("/", isLogged, isAdmin, getAllUsers);
router.get("/:id", isLogged, isAdmin, getUserById);
router.post("/", isLogged, isAdmin, upload, createUser);
router.patch("/:id", isLogged, isAdmin, upload, editUser);
router.delete("/:id", isLogged, isAdmin, deleteUser);

module.exports = router;
