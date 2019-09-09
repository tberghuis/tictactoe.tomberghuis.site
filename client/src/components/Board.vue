<template>
  <div
    class="board"
    :style="{width: boardSize+'px',height:boardSize+'px',fontSize:boardFontSize+'px'}"
  >
    <div class="board-row">
      <div class="board-col" @click="cellClick(0,0)">{{board[0][0]}}</div>
      <div class="board-col" @click="cellClick(0,1)">{{board[0][1]}}</div>
      <div class="board-col" @click="cellClick(0,2)">{{board[0][2]}}</div>
    </div>
    <div class="board-row">
      <div class="board-col" @click="cellClick(1,0)">{{board[1][0]}}</div>
      <div class="board-col" @click="cellClick(1,1)">{{board[1][1]}}</div>
      <div class="board-col" @click="cellClick(1,2)">{{board[1][2]}}</div>
    </div>
    <div class="board-row">
      <div class="board-col" @click="cellClick(2,0)">{{board[2][0]}}</div>
      <div class="board-col" @click="cellClick(2,1)">{{board[2][1]}}</div>
      <div class="board-col" @click="cellClick(2,2)">{{board[2][2]}}</div>
    </div>
  </div>
</template>

<script>
import { socketHolder } from "@/services/socket";
export default {
  name: "Board",
  props: {},
  data: function() {
    return { boardSize: 300 };
  },
  computed: {
    boardFontSize() {
      return this.boardSize / 4;
    },
    board() {
      return this.gameRoom.board;
    },
    gameRoom() {
      return this.$store.state.gameRoom;
    },
    isPlayer1() {
      return socketHolder.socket.id === this.gameRoom.player1;
    },
    isPlayerTurn() {
      return (
        (this.isPlayer1 && this.gameRoom.gameState === "PLAYER_1_TURN") ||
        (!this.isPlayer1 && this.gameRoom.gameState === "PLAYER_2_TURN")
      );
    }
  },
  methods: {
    cellClick(row, col) {
      if (!this.isPlayerTurn || this.board[row][col] !== "") {
        return;
      }
      
      socketHolder.socket.emit("c2s-player-turn", {
        gameRoomId: this.gameRoom.gameRoomId,
        row,
        col
      });
    }
  }
};
</script>

<style scoped>
.board {
  background-image: url(/images/board-background.svg);
  background-size: contain;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  line-height: normal;
}
.board-row {
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
}
.board-col {
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
