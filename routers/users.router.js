const router = require("express").Router();
const { isLogged, isAdmin } = require("../middlewares/auth.guard");
const {
    createUser,
    getAllUsers,
    getUserById,
    editUser,
    deleteUser,
} = require("../controllers/users.controller");

router.get("/", isLogged, isAdmin, getAllUsers);
router.get("/:id", isLogged, isAdmin, getUserById);
router.post("/", isLogged, isAdmin, createUser);
router.patch("/:id", isLogged, isAdmin, editUser);
router.delete("/:id", isLogged, isAdmin, deleteUser);

module.exports = router;
