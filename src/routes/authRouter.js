import { Router } from "express";
import { postChoice } from "../controlles/choiceControllers.js";
import { getPool, postPool } from "../controlles/poolController.js";

const authRouter = Router();

authRouter.post("/pool", postPool);
authRouter.get("/pool", getPool);
authRouter.post("/choice", postChoice);





export default authRouter; 
