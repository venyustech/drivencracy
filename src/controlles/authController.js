import joi from "joi";
import db from "../db.js";

const postPoolSchema = joi.object({
    title: joi.string().min(1).trim().required(),
    expireAt: joi.string().required(),
});


export async function postPool(req, res) {
    const validation = postPoolSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    try {
        const pool = await db.collection("pool").findOne({ title });
        if (!pool) {
            await db
                .collection("pool")
                .insertOne({ title: postPool.title, expireAt: postPool.expireAt });
            res.status(201).send({ title: postPool.title, expireAt: postPool.expireAt });
        } else res.status(401).send("pergunta ja existente");
    } catch (error) {
        res.status(500).send(error);
    }
}