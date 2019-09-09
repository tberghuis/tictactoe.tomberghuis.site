const server = require("./server");
module.exports = require("socket.io")(server);
