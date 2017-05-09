module.exports = (db) => {
    const get = (req, res) => {
        let feedback = db("feedback");
        res.status(201).send({
            result: feedback
        });
    };

    const post = (req, res) => {
        let reqUserId = req.body.id;
        let authKey = req.headers[AUTH_KEY_HEADER_NAME];

        let user = db("users").find({
            id: reqUserId
        });

        if (!user || user.authKey !== authKey) {
            return res.status(422)
                .send("Invalid credentials.");
        }
        
        let reqFeedback = req.body.feedback;
        if (!reqFeedback || typeof reqFeedback.name !== "string" || typeof reqFeedback.title !== "string" || typeof reqFeedback.message !== "string") {
            return res.status(422)
                .send("Invalid Post");
        }

        db("feedback").insert(reqFeedback);

        return res.status(201).send();
    };

    const put = (req, res) => {
        let reqUserId = req.body.id;
        let authKey = req.headers[AUTH_KEY_HEADER_NAME];

        let user = db("users").find({
            id: reqUserId
        });

        if (!user || user.authKey !== authKey) {
            return res.status(422)
                .send("Invalid credentials.");
        }

        let feedbackId = req.params.id,
            feedbacks = db("feedback");

        if (!feedbacks) {
            res.status(422)
                .send("Invalid Operation");
        }

        feedbacks.splice(feedbackId, 1);

        return res.status(201).send();
    };

    return {
        get,
        post,
        put
    };
};