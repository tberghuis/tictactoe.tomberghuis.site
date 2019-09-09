const { gameRooms, endGameRoom } = require("./gameRooms");
const io = require("./io");
const { sLobbyJoin } = require("./lobby");

const gameEvents = client => {
  client.on("c2s-player-turn", ({ gameRoomId, row, col }) => {
    // TODO validate data from client
    // TODO authorised, meaning state expects this event should be allowed/ possible
    // its just tictactoe, trust the client for now

    const gameRoom = gameRooms[gameRoomId];
    const { board } = gameRoom;
    const isPlayer1 = gameRoom.player1 === client.id;

    const clientSymbol = isPlayer1 ? "O" : "X";
    // lets just mutate gameRoom
    board[row][col] = clientSymbol;

    if (isGameWon(board)) {
      gameRoom.gameState = isPlayer1 ? "PLAYER_1_WINNER" : "PLAYER_2_WINNER";
      gameRoom.gameResults.push(isPlayer1 ? "PLAYER_1" : "PLAYER_2");
    } else if (!board.flat().includes("")) {
      gameRoom.gameState = "DRAW";
      gameRoom.gameResults.push("DRAW");
    } else {
      gameRoom.gameState =
        gameRoom.gameState === "PLAYER_1_TURN"
          ? "PLAYER_2_TURN"
          : "PLAYER_1_TURN";
    }

    // update clients
    io.to(gameRoom.player1).emit("s2c-game-room-update", gameRoom);
    io.to(gameRoom.player2).emit("s2c-game-room-update", gameRoom);
  });

  // do it a crude way, where 2 keys for rematch is good enough
  // this is stateful
  client.on("c2s-rematch", gameRoomId => {
    const gameRoom = gameRooms[gameRoomId];
    gameRoom.rematch[client.id] = true;
    if (Object.keys(gameRoom.rematch).length === 2) {
      // reset match by mutating, this is bad
      gameRoom.rematch = {};
      gameRoom.board = [["", "", ""], ["", "", ""], ["", "", ""]];
      gameRoom.gameState =
        gameRoom.gameResults.length % 2 === 0
          ? "PLAYER_1_TURN"
          : "PLAYER_2_TURN";
      io.to(gameRoom.player1).emit("s2c-game-room-update", gameRoom);
      io.to(gameRoom.player2).emit("s2c-game-room-update", gameRoom);
    }
  });

  client.on("c2s-exit", gameRoomId => {
    endGameRoom(gameRoomId);
  });
};

module.exports = gameEvents;

const isGameWon = board => {
  const didWinRow = rowIndex => {
    return (
      board[rowIndex][0] !== "" &&
      board[rowIndex][0] === board[rowIndex][1] &&
      board[rowIndex][1] === board[rowIndex][2]
    );
  };

  const didWinCol = colIndex => {
    return (
      board[0][colIndex] !== "" &&
      board[0][colIndex] === board[1][colIndex] &&
      board[1][colIndex] === board[2][colIndex]
    );
  };

  const didWinDiag = () => {
    return (
      board[1][1] !== "" &&
      ((board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
        (board[2][0] === board[1][1] && board[1][1] === board[0][2]))
    );
  };

  if (
    didWinRow(0) ||
    didWinRow(1) ||
    didWinRow(2) ||
    didWinCol(0) ||
    didWinCol(1) ||
    didWinCol(2) ||
    didWinDiag()
  ) {
    return true;
  }
  return false;
};
