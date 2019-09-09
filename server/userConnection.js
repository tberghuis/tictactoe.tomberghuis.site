const { sLobbyJoin, sLobbyLeave } = require("./lobby");
const users = require("./users");
const { gameRooms, endGameRoom } = require("./gameRooms");

const userConnected = id => {
  sLobbyJoin.next(id);
};

const userDisconnected = id => {
  // end any game participating
  Object.values(gameRooms)
    .filter(gr => gr.player1 === id || gr.player2 === id)
    .forEach(gr => {
      endGameRoom(gr.gameRoomId);
    });

  sLobbyLeave.next(id);
  delete users[id];
};

module.exports = { userConnected, userDisconnected };
