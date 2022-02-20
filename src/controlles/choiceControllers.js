import joi from "joi";
import { ObjectId } from "mongodb";
import db from "../db.js";
import dayjs from "dayjs";


const postChoiceSchema = joi.object({
    title: joi.string().min(1).trim().required(),
    poolId: joi.string().required(),
});

export async function postChoice(req, res) {
    const { title, poolId } = req.body;
    const validation = postChoiceSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const isTherePool = await db.collection("pool").findOne({ _id: new ObjectId(poolId) });
        const isThereChoice = await db.collection("choices").findOne({ title });

        if (!isTherePool)
            return res.status(404).send("esse id questionário não existe");

        if (isThereChoice)
            return res.status(409).send("essa pergunta já existe");

        let hasPoolExpired = dayjs(isTherePool.expireAt).isBefore(dayjs())
        if (hasPoolExpired)
            return res.status(403).send("essa pergunta já expirou");

        await db
            .collection("choices")
            .insertOne({
                title: title,
                poolId: poolId
            });
        res.status(201).send({
            title: title,
            poolId: poolId
        });

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getChoicesById(req, res) {
    const index = req.params.id;
    try {
        const pool = await db.collection("pool").findOne({ _id: new ObjectId(index) });
        if (!pool)
            return res.status(404).send("enquete nao existe");

        db.collection("choices").find({ poolId: index }).toArray(function (err, results) {
            res.send(results);
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
}