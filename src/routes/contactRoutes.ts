import express from "express";
import { identifyContact } from "../controllers/contactController";

const router = express.Router();

router.route("/identify").post(identifyContact);

export default router;
