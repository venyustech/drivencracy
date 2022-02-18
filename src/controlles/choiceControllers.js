import joi from "joi";
import db from "../db.js";


const postChoiceSchema = joi.object({
    title: joi.string().min(1).trim().required(),
    poolId: joi.string().required(),
});

export async function postChoice(req, res) {
    const { title, poolId } = req.body;
    let id = 0;
    const validation = postChoiceSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    db.collection("choices").find({}).toArray(function (err, results) {
        if (results != 0) {
            id = results.length;
        }
    });

    try {
        const isTherePool = await db.collection("pool").findOne({ id: parseInt(poolId) });
        if (isTherePool) {
            const isThereChoice = await db.collection("choices").findOne({ title });
            if (isThereChoice) {
                console.log("achei uma igual:", isThereChoice)
                res.status(409).send("esse titulo ja existe");
            }
            else {
                await db
                    .collection("choices")
                    .insertOne({
                        id: id,
                        title: title,
                        poolId: poolId
                    });
                res.status(201).send({
                    id: id,
                    title: title,
                    poolId: poolId
                });
            }
        } else res.status(404).send("pergunta com esse poolId não existe");
    } catch (error) {
        res.status(500).send(error);
    }
}

export async function getChoicesById(req, res) {

    try {
        const pool = await db.collection("pool").findOne({ id: parseInt(req.params.id) });
        if (pool) {
            await db.collection("choices").find({ poolId: req.params.id }).toArray(function (err, results) {
                res.send(results);
            });
        } else res.status(404).send("enquete nao existe");

    } catch (error) {
        res.status(500).send(error.message);
    }
}