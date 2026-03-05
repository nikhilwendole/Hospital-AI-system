const express = require("express");
const router = express.Router();
const { getStats, getAllUsers, deleteUser } = require("../controllers/adminController");
const { protect, roleCheck } = require("../middleware/auth");

router.use(protect, roleCheck("admin"));

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

module.exports = router;
