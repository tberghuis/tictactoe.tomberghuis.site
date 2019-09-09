<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline">Tic-Tac-Toe</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu left bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="loggedIn" @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
          <v-list-item v-if="loggedIn===false" @click="loginGoogle">
            <v-list-item-title>Login</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <Login v-if="loggedIn===false" />
      <Lobby v-else-if="loggedIn===true && !gameRoom" />
      <GameRoom v-else-if="gameRoom" />
    </v-content>
  </v-app>
</template>

<script>
import Login from "./views/Login";
import Lobby from "./views/Lobby";
import GameRoom from "./views/GameRoom";

import { loginGoogle, logout } from "@/services/auth";

export default {
  name: "App",
  components: {
    Login,
    Lobby,
    GameRoom
  },
  data: () => ({
    //
  }),
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    },
    gameRoom() {
      return this.$store.state.gameRoom;
    }
  },
  methods: {
    logout() {
      logout();
      this.$store.commit("updateGameRoom", null);
    },
    loginGoogle() {
      loginGoogle();
    }
  }
};
</script>
