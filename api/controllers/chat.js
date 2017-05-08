let io = require("socket.io")();

module.exports = (server) => {
    const get = (req, res) => {
        console.log("I am in chat get");
    };

    const setup = () => {
        io.attach(server);

        io.on("connection", (socket) => {
            console.log("user connected")
        });

        io.on("disconnect", (socket) => {
            console.log("user disconnected");
        });
    };
    return {
        get,
        setup
    };
};
