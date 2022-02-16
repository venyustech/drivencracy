
import db from "../db.js";

export async function postPool(req, res) {

    try {
        res.send("ok")
    } catch (error) {
        res.status(500).send(error.message);
    }
}
//axios.post("https:loscomse.com/pool", { title: "Qual a sua linguagem favorita?", expireAt: "2022-02-28 01:00"})