import { Router } from "express";
import { postPool } from "../controlles/authController.js";

const authRouter = Router();

authRouter.post("/pool", postPool);


export default authRouter; 
