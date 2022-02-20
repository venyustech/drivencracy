import joi from "joi";
import db from "../db.js";
import dayjs from "dayjs";

const postPoolSchema = joi.object({
    title: joi.string().min(1).trim().required(),
    expireAt: joi.string().required().allow(""),
});


export async function postPool(req, res) {
    const { title, expireAt } = req.body;
    let expireAtNotEmpty = expireAt;

    const validation = postPoolSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const pool = await db.collection("pool").findOne({ title });
        if (pool)
            return res.status(401).send("pergunta ja existente");
        if (expireAt === "")
            expireAtNotEmpty = dayjs().add(30, 'day').format('YYYY-MM-DD HH:mm')
        await db
            .collection("pool")
            .insertOne({
                title: title,
                expireAt: expireAtNotEmpty
            });
        res.status(201).send({
            title: title,
            expireAt: expireAtNotEmpty
        });

    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getPool(req, res) {
    try {
        db.collection("pool").find({}).toArray(function (err, results) {
            res.send(results);
        });

    } catch (error) {
        res.status(500).send(error);
    }
}

