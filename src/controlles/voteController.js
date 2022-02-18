import db from "../db.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function postVoteById(req, res) {
    const index = req.params.id;
    let todayDate = dayjs().format('YYYY-MM-DD HH:mm');

    try {
        const choice = await db.collection("choices").findOne({ _id: new ObjectId(index) });
        if (!choice)
            res.status(404).send("escolha não existente");
        else {
            await db.collection("vote").insertOne({
                createdAt: todayDate,
                choiceId: index,
            });
            res.status(201).send("OK");
        }

    }
    catch (error) {
        console.log(error.message)
        res.status(500).send(error.message);
    }
}
