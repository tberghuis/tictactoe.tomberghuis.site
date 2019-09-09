const server = require("./server");
const io = require("./io");
const firebaseAdmin = require("firebase-admin");
const users = require("./users");
require("./clientConnections");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault()
});

io.use(async (socket, next) => {
  const { id_token } = socket.handshake.query;
  if (!id_token) {
    next(new Error("Authentication error"));
    return;
  }
  const { name, picture } = await firebaseAdmin.auth().verifyIdToken(id_token);

  // add to users singleton
  users[socket.id] = {
    id: socket.id,
    name,
    picture
  };

  next();
});

const port = process.env.PORT || 3001;
server.listen(port);
