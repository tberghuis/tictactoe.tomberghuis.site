import io from "socket.io-client";
import bsUser from "@/subjects/user";
import { skip } from "rxjs/operators";
import store from "@/store";

export const socketHolder = { socket: null };
window.socketHolder = socketHolder;

const socketUrl = process.env.VUE_APP_SOCKET_URL;

const socketConnect = async user => {
  const id_token = await user.getIdToken();
  socketHolder.socket = io(socketUrl, {
    query: { id_token }
  });
  // handleSocketEvents(socketHolder.socket);
  handleSocketEvents();
};

const socketDisconnect = () => {
  if (socketHolder.socket) {
    socketHolder.socket.disconnect();
  }
};

bsUser.pipe(skip(1)).subscribe({
  next: user => {
    const loggedIn = !!user;
    if (loggedIn) {
      socketConnect(user);
      const { displayName, photoURL } = user;
      store.state.user = { displayName, photoURL };
    } else {
      socketDisconnect();
      store.state.user = null;
    }
    // not the best place for this logic, meh
    store.state.loggedIn = loggedIn;
  }
});

const handleSocketEvents = () => {
  const { socket } = socketHolder;
  console.log("TCL: socket", socket);
  socket.on("lobby users", function(lobbyUsers) {
    console.log("TCL: lobbyUsers", lobbyUsers);

    const lus = lobbyUsers.filter(lu => lu.id !== socket.id);
    // TODO use mutation
    store.state.lobbyUsers = lus;
  });

  socket.on("accept invite", function(hostUser) {
    // TODO use mutation
    store.state.gameInvites.push(hostUser);
  });

  socket.on("s2c-game-room-start", function(gameRoom) {
    store.state.gameInvites = [];
    store.commit("updateGameRoom", gameRoom);
  });

  socket.on("s2c-game-room-update", function(gameRoom) {
    store.commit("updateGameRoom", gameRoom);
  });

  socket.on("s2c-game-exit", function() {
    store.commit("updateGameRoom", null);
  });
};
