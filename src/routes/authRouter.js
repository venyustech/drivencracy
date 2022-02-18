import { Router } from "express";
import { getChoicesById, postChoice } from "../controlles/choiceControllers.js";
import { getPool, postPool } from "../controlles/poolController.js";
import { getResultById } from "../controlles/resultController.js";
import { postVoteById } from "../controlles/voteController.js";

const authRouter = Router();

authRouter.post("/pool", postPool);
authRouter.get("/pool", getPool);
authRouter.post("/choice", postChoice);
authRouter.get("/pool/:id/choice", getChoicesById)
authRouter.post("/choice/:id/vote", postVoteById)
authRouter.get("/pool/:id/result", getResultById) //coloca id da pergunta e retorna a pergunta mais votada e qts de votos




export default authRouter; 
