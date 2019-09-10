<template>
  <v-container>
    <v-row>
      <v-col align="center" justify="center">
        <h1>Tic-tac-toe</h1>
        <h2>multiplayer (works with multiple windows)</h2>
        <p>
          <v-btn class="mt-8" dark color="red" @click="loginGoogle">Login with Google</v-btn>
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { loginGoogle } from "@/services/auth";

export default {
  data: () => ({}),
  methods: {
    loginGoogle() {
      loginGoogle();
    }
  }
};
</script>
