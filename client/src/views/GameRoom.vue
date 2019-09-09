<template>
  <v-container>
    <v-row>
      <v-col>
        <v-avatar class="mr-1" size="36px">
          <img :src="gameRoom.player1Details.picture" />
        </v-avatar>
        {{gameRoom.player1Details.name}}
      </v-col>
      <v-col>
        <span>
          (
          <strong>O</strong>)
        </span>
      </v-col>
      <v-col v-if="isPlayer1">{{scorePlayer1}}</v-col>
      <v-col v-else></v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-avatar class="mr-1" size="36px">
          <img :src="gameRoom.player2Details.picture" />
        </v-avatar>
        {{gameRoom.player2Details.name}}
      </v-col>
      <v-col>
        <span>
          (
          <strong>X</strong>)
        </span>
      </v-col>
      <v-col v-if="!isPlayer1">{{scorePlayer2}}</v-col>
      <v-col v-else></v-col>
    </v-row>
    <v-row>
      <v-col v-html="gameStateText"></v-col>
    </v-row>
    <v-row v-if="isGameFinished">
      <v-col>
        <v-btn color="primary" @click="rematch">Rematch</v-btn>
        <v-btn class="ml-4" color="secondary" @click="exit">Exit to lobby</v-btn>
      </v-col>
    </v-row>
    <Board></Board>
  </v-container>
</template>

<script>
import { socketHolder } from "@/services/socket";
import Board from "@/components/Board";
export default {
  components: {
    Board
  },
  data: () => ({}),
  computed: {
    gameRoom() {
      return this.$store.state.gameRoom;
    },
    gameState() {
      return this.gameRoom.gameState;
    },
    isGameFinished() {
      return ["DRAW", "PLAYER_1_WINNER", "PLAYER_2_WINNER"].includes(
        this.gameState
      );
    },
    playerTurn() {
      if (
        (this.gameState === "PLAYER_1_TURN" && this.isPlayer1) ||
        (this.gameState === "PLAYER_2_TURN" && !this.isPlayer1)
      ) {
        return "your turn (<strong>" + this.playerSymbol + "</strong>)";
      }
      return "opponent turn (<strong>" + this.opponentSymbol + "</strong>)";
    },
    playerSymbol() {
      return this.isPlayer1 ? "O" : "X";
    },
    opponentSymbol() {
      return this.isPlayer1 ? "X" : "O";
    },
    isPlayer1() {
      return socketHolder.socket.id === this.gameRoom.player1;
    },
    player1Wins() {
      return this.gameRoom.gameResults.filter(gr => gr === "PLAYER_1").length;
    },
    player2Wins() {
      return this.gameRoom.gameResults.filter(gr => gr === "PLAYER_2").length;
    },
    numDraws() {
      return this.gameRoom.gameResults.filter(gr => gr === "DRAW").length;
    },
    scorePlayer1() {
      return `${this.player1Wins} win, ${this.player2Wins} loss, ${this.numDraws} draw`;
    },
    scorePlayer2() {
      return `${this.player2Wins} win, ${this.player1Wins} loss, ${this.numDraws} draw`;
    },
    gameStateText() {
      if (
        this.gameState === "PLAYER_1_WINNER" ||
        this.gameState === "PLAYER_2_WINNER"
      ) {
        if (
          (this.isPlayer1 && this.gameState === "PLAYER_1_WINNER") ||
          (!this.isPlayer1 && this.gameState === "PLAYER_2_WINNER")
        ) {
          return "Congrats! You won this game.";
        }
        return "Sorry, you lost.";
      }
      if (this.gameState === "DRAW") {
        return "Game is a draw.";
      }
      return this.playerTurn;
    }
  },
  watch: {},
  methods: {
    rematch() {
      socketHolder.socket.emit("c2s-rematch", this.gameRoom.gameRoomId);
    },
    exit() {
      socketHolder.socket.emit("c2s-exit", this.gameRoom.gameRoomId);
    }
  }
};
</script>

<style>
</style>