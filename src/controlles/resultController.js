import { ObjectId } from "mongodb";
import db from "../db.js";

export async function getResultById(req, res) {
    const poolId = req.params.id;

    let biggerVotes = 0;
    let choiceElement = 0;

    try {
        const isTherePool = await db.collection("pool").findOne({ _id: new ObjectId(poolId) });
        if (!isTherePool)
            return res.status(404).send("enquete nao existe");

        const choices = await db.collection("choices").find({ poolId: poolId }).toArray();

        for (let choice in choices) {
            const votes = await db.collection("vote").find({ choiceId: choices[choice]._id.toString() }).toArray();

            if (votes.length > biggerVotes) {
                biggerVotes = votes.length
                choiceElement = choice;
            }

            const isLastIteration = parseInt(choice) === choices.length - 1;
            if (isLastIteration)
                res.send({
                    ...isTherePool,
                    result: {
                        title: choices[choiceElement].title,
                        votes: biggerVotes
                    }
                })
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}