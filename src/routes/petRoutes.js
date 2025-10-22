import { Router } from "express";
import {
  getPets,
  createPet,
  updatePet,
  deletePet,
} from "../controllers/petController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";

const router = Router();

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
