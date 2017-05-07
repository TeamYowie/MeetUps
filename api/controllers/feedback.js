module.exports = (db) => {
    const get = (req, res) => {
        let feedback = db("feedback");
        res.status(201).send({
            result: feedback
        });
    };

    const post = (req, res) => {
        let reqFeedback = req.body;
        if (!reqFeedback || typeof reqFeedback.name !== "string" || typeof reqFeedback.title !== "string" || typeof reqFeedback.message !== "string") {
            return res.status(422)
                .send("Invalid Post");
        }

        db("feedback").insert(reqFeedback);

        return res.status(201).send();
    };

    const put = (req, res) => {
        let id = req.params.id;

        db.get(`feedback[${id}]`)
            .remove()
            .write();

        return res.status(201).send();

    };

    return {
        get,
        post,
        put
    };
};