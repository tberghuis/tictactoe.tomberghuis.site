import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    loggedIn: null,
    lobbyUsers: [],
    user: null, // {displayName,photoURL}
    gameInvites: [],
    gameRoom: null
  },
  mutations: {
    updateGameRoom(state, gameRoom) {
      state.gameRoom = gameRoom;
    },
    declineInvite(state) {
      state.gameInvites.shift();
    }
  },
  actions: {}
});

export default store;

window.STORE = store;
