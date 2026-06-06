const express = require("express");
const router = express.Router();
const { isAuth } = require("../config/auth");

const {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
} = require("../controller/adminController");

const { passwordVerificationLimit } = require("../lib/email-sender/sender");

/**
 * Admin Authentication
 */
// Register admin/staff
router.post("/register", registerAdmin);
// Admin login
router.post("/login", loginAdmin);
// Forget password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);
// Reset password
router.put("/reset-password", resetPassword);

/**
 * Staff Management
 */
// Add a staff
router.post("/add", isAuth, addStaff);
// Get all staff
router.get("/", isAuth, getAllStaff);
// Get a single staff by ID (changed to GET from POST)
router.get("/:id", isAuth, getStaffById);
// Update a staff by ID
router.put("/:id", isAuth, updateStaff);
// Update staff status by ID
router.put("/update-status/:id", isAuth, updatedStatus);
// Delete a staff by ID
router.delete("/:id", isAuth, deleteStaff);

module.exports = router;
