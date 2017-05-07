module.exports = (db) => {
    const get = (req, res) => {
        let feedback = db("feedback");
        res.status(201).send({
            result: feedback
        });
    };
    const post = (req, res) => {
        let reqUser = req.body;
        if (!reqUser || typeof reqUser.username !== "string" || typeof reqUser.passHash !== "string") {
            return res.status(422)
                .send("Invalid username or password");
        }

        let duplicateUser = db("users").find({
            usernameLower: reqUser.username.toLowerCase()
        });

        if (duplicateUser) {
            return res.status(409)
                .send('Duplicated user');
        }

        reqUser.usernameLower = reqUser.username.toLowerCase();
        reqUser.id = idGenerator.get();
        db("users").insert(reqUser);

        return res.status(201).send({
            result: {
                username: reqUser.username,
            }
        });
    };

    return {
        get,
        post
    };
};