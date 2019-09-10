const users = require("./users");
const { BehaviorSubject, Subject } = require("rxjs");
const io = require("./io");

const bsLobby = new BehaviorSubject([
  // id, ...
]);

// global.bsLobby = bsLobby;
const sLobbyJoin = new Subject();
const sLobbyLeave = new Subject();

module.exports = { bsLobby, sLobbyJoin, sLobbyLeave };

sLobbyJoin.subscribe({
  next: id => {
    if (bsLobby.value.indexOf(id) === -1) {
      const nextLobby = [...bsLobby.value, id];
      bsLobby.next(nextLobby);
    }
  }
});

sLobbyLeave.subscribe({
  next: id => {
    // do i really need to worry about mutating behavior subject?
    const lobby = [...bsLobby.value];
    if (lobby.indexOf(id) > -1) {
      lobby.splice(lobby.indexOf(id), 1);
      bsLobby.next(lobby);
    }
  }
});

bsLobby.subscribe({
  next: lobby => {
    const lobbyUsers = lobby.map(id => users[id]).filter(lu => lu !== null);
    lobby.forEach(lobbyId => {
      io.to(lobbyId).emit("lobby users", lobbyUsers);
    });
  }
});
