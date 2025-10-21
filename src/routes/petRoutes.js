import { Router } from "express";
import { getPets, createPet } from "../controllers/petController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { checkRole } from "../middlewares/roleMiddleware.js";

const router = Router();

// Ruta pública - cualquiera con token válido puede ver mascotas
router.get("/pets", verifyToken, getPets);

// Ruta protegida - solo admin y veterinarian pueden crear mascotas
router.post("/pets", verifyToken, checkRole("admin", "veterinarian"), createPet);

export default router;
