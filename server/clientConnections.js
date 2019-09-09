const { userConnected, userDisconnected } = require("./userConnection");
const io = require("./io");
const users = require("./users");
const { createGameRoom } = require("./gameRooms");
const { sLobbyLeave } = require("./lobby");

const gameEvents = require("./gameEvents");

io.on("connection", client => {
  // adds user to lobby
  userConnected(client.id);

  client.on("disconnect", () => {
    // removes user from lobby and users
    userDisconnected(client.id);
  });

  client.on("invite user", invitedId => {
    // send the user object
    io.to(invitedId).emit("accept invite", users[client.id]);
  });

  client.on("invite accepted", hostId => {
    sLobbyLeave.next(hostId);
    sLobbyLeave.next(client.id);
    createGameRoom(hostId, client.id);
  });

  gameEvents(client);
});
