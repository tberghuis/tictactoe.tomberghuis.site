const io = require("./io");
const uuid = require("uuidv4").default;
const users = require("./users");
const { sLobbyJoin } = require("./lobby");

// in future do not export app state objects, mutate through function
// call next on object updated subject

const gameRooms = {
  // [gameRoomId]: {
  //     gameRoomId:
  //     player1: // i.e. socket/client id
  //     player2:
  //     player1Details:
  //     player1Details:
  //     board:
  //     gameResults: PLAYER_1, PLAYER_2, ...
  //     gameState: PLAYER_1_TURN | PLAYER_2_TURN | DRAW | PLAYER_1_WINNER
  //     rematch: {[playerid]:true, ...}
  // }, ...
};
// global.gameRooms = gameRooms;

// assume clients act in good faith, skip validation and authorization checks
const createGameRoom = (player1, player2) => {
  gameRoomId = uuid();
  const player1Details = users[player1];
  const player2Details = users[player2];
  gameRooms[gameRoomId] = {
    gameRoomId,
    player1,
    player2,
    board: [["", "", ""], ["", "", ""], ["", "", ""]],
    gameResults: [],
    gameState: "PLAYER_1_TURN",
    rematch: {},
    player1Details,
    player2Details
  };
  emitGameRoom(gameRooms[gameRoomId]);
};

const emitGameRoom = gameRoom => {
  io.to(gameRoom.player1).emit("s2c-game-room-start", gameRoom);
  io.to(gameRoom.player2).emit("s2c-game-room-start", gameRoom);
};

const endGameRoom = gameRoomId => {
  const gameRoom = gameRooms[gameRoomId];

  sLobbyJoin.next(gameRoom.player1);
  sLobbyJoin.next(gameRoom.player2);

  delete gameRooms[gameRoomId];

  io.to(gameRoom.player1).emit("s2c-game-exit");
  io.to(gameRoom.player2).emit("s2c-game-exit");
};

module.exports = { gameRooms, createGameRoom, endGameRoom };
