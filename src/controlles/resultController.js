import db from "../db.js";

export async function getResultById(req, res) {
    const poolId = req.params.id;
    let biggerVotes = 0;
    let choiceId = 0;
    try {
        const pool = await db.collection("pool").findOne({ id: parseInt(poolId) });
        if (!pool)
            res.status(404).send("enquete nao existe");

        const choices = await db.collection("choices").find({ poolId: poolId }).toArray();
        for (let choiceIndex in choices) {
            const votes = await db.collection("vote").find({ choiceId: choices[choiceIndex].id }).toArray();
            if (votes.length > biggerVotes) {
                biggerVotes = votes.length
                choiceId = votes[0].choiceId

                const isLastIteration = parseInt(choiceIndex) === choices.length - 1;
                if (isLastIteration) {
                    res.send({
                        ...pool,
                        result: {
                            title: choices[choiceId].title,
                            votes: biggerVotes
                        }
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}