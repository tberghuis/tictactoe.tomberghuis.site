<template>
  <v-container>
    <h1>Lobby</h1>
    <v-row v-for="lu in lobbyUsers" :key="lu.id">
      <v-col>
        <v-avatar class="mr-2" size="36px">
          <img :src="lu.picture" />
        </v-avatar>
        <span>{{lu.name}}</span>
      </v-col>
      <v-col>
        <v-switch
          class="mt-0"
          :readonly="switchReadOnly[lu.id]"
          v-model="switchState"
          :value="lu.id"
          label="invite"
          @change="inviteToggle(lu.id)"
        ></v-switch>
      </v-col>
    </v-row>
    <v-dialog persistent v-model="inviteDialog" max-width="290">
      <v-card v-if="inviteUser">
        <!-- TODO back button hide dialog? -->
        <v-card-title class="headline">Accept game invite</v-card-title>
        <v-list-item>
          <v-list-item-avatar>
            <v-img class="elevation-6" :src="inviteUser.picture"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{inviteUser.name}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="declineInvite">Decline</v-btn>
          <v-btn color="green darken-1" text @click="acceptInvite">Accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { socketHolder } from "@/services/socket";
export default {
  data: () => ({
    switchState: [],
    switchReadOnly: {},
    inviteDialog: false,
    inviteUser: null
  }),
  computed: {
    lobbyUsers() {
      return this.$store.state.lobbyUsers;
    },
    gameInvites() {
      return this.$store.state.gameInvites;
    }
  },
  watch: {
    gameInvites: function(val) {
      this.inviteUser = val[0];
      this.inviteDialog = val.length > 0;
    }
  },
  methods: {
    inviteToggle(invitedId) {
      const sendInvite = this.switchState.includes(invitedId);
      if (sendInvite) {
        socketHolder.socket.emit("invite user", invitedId);
        // disable withdraw invite cause i'm lazy
        this.switchReadOnly[invitedId] = true;
      }
    },
    acceptInvite() {
      socketHolder.socket.emit("invite accepted", this.inviteUser.id);
    },
    declineInvite() {
      this.$store.commit("declineInvite");
    }
  }
};
</script>

<style>
</style>