import express from 'express';
import { identify } from '../controllers/identifyController';


const router = express.Router();

router.route("/identify").post(identify); // ✅ Fix: Directly using post()



export default router;