import { Router } from "express";
import { getPets, createPet } from "../controllers/petController.js";

const router = Router();

router.get("/pets", getPets);
router.post("/pets", createPet);

export default router;
