import { Router } from "express";
import { getPool, postPool } from "../controlles/authController.js";

const authRouter = Router();

authRouter.post("/pool", postPool);
authRouter.get("/pool", getPool);



export default authRouter; 
