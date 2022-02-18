import joi from "joi";
import db from "../db.js";
import dayjs from "dayjs";

export async function postVoteById(req, res) {

    try {
        let todayDate = dayjs().format('YYYY-MM-DD HH:mm');
        const choice = await db.collection("choices").findOne({ id: parseInt(req.params.id) });

        if (choice) {
            await db.collection("vote").insertOne({
                createdAt: todayDate,
                choiceId: req.params.id,
            });
            res.status(201).send("OK");
        } else res.status(404).send("escolha não existente");
    } catch (error) {
        console.log(error.message)
        res.status(500).send(error.message);
    }
}
