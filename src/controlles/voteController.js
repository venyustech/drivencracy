import db from "../db.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function postVoteById(req, res) {
    const index = req.params.id;
    let todayDate = dayjs().format('YYYY-MM-DD HH:mm');

    try {
        const choice = await db.collection("choices").findOne({ _id: new ObjectId(index) });

        if (!choice)
            return res.status(404).send("escolha não existente");

        const pool = await db.collection("pool").findOne({ _id: new ObjectId(choice.poolId) });
        let hasPoolExpired = dayjs(pool.expireAt).isBefore(dayjs())

        if (hasPoolExpired)
            return res.status(403).send("essa pergunta já expirou, nao tem como votar");

        await db.collection("vote").insertOne({
            createdAt: todayDate,
            choiceId: index,
        });
        res.status(201).send("OK");

    }
    catch (error) {
        res.status(500).send(error.message);
    }
}
