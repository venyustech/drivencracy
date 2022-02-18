import express, { json } from "express";
import cors from "cors";
import dayjs from "dayjs";
import "dayjs/locale/pt-br.js";
import router from "./routes/index.js";

const server = express();

server.use(json());
server.use(cors());

server.use(router);


server.listen(5001, () => console.log("Server in http://localhost:5001/"));
