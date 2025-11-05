import { Router } from "express";
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} from "../controllers/petController.js";
import { fetchUsers } from "../controllers/usersController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";

const router = Router();

/**
 * @route   GET /api/patients/users
 * @desc    Get users from Auth Service (for pet owner selection)
 * @access  Private (admin, receptionist)
 */
router.get(
  "/users",
  verifyToken,
  checkRole("admin", "receptionist", "veterinarian"),
  fetchUsers
);

/**
 * @route   GET /api/patients/pets
 * @desc    Get all pets with pagination
 * @access  Private (cualquier usuario autenticado)
 */
router.get(
  "/pets",
  verifyToken,
  checkRole("admin", "veterinarian", "receptionist"),
  getPets
);

/**
 * @route   GET /api/patients/pets/:id
 * @desc    Get a specific pet by ID
 * @access  Private (cualquier usuario autenticado)
 */
router.get(
  "/pets/:id",
  verifyToken,
  getPetById
);

/**
 * @route   POST /api/patients/pets
 * @desc    Create a new pet
 * @access  Private (admin, veterinarian)
 */
router.post(
  "/pets",
  verifyToken,
  checkRole("admin", "receptionist"),
  createPet
);

/**
 * @route   PUT /api/patients/pets/:id
 * @desc    Update a pet by ID
 * @access  Private (admin, receptionist)
 */
router.put(
  "/pets/:id",
  verifyToken,
  checkRole("admin", "receptionist"),
  updatePet
);

/**
 * @route   DELETE /api/patients/pets/:id
 * @desc    Soft delete a pet (set isActive to false)
 * @access  Private (admin, receptionist)
 */
router.delete(
  "/pets/:id",
  verifyToken,
  checkRole("admin", "receptionist"),
  deletePet
);

export default router;
