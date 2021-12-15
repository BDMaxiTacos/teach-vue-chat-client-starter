<template>
  <div class="group">
    <div class="ui fluid search" v-if="conversation.isManyToMany">
      <div class="ui icon input">
        <input
          type="text"
          placeholder="Rechercher un utilisateur"
          class="prompt"
          v-model="search"
        /><i class="search icon"></i>
      </div>
    </div>
    <div class="spanner">
      <hr />
      <span>Participants</span>
      <hr />
    </div>
    <div v-for="user in filtreGroup" :key="user.id" class="user">
      <img :src="user.picture_url" /><span
        >{{ user.username }}<br /><i class="nickname"></i></span
      ><i title="Modifier le surnom" class="circular quote left link icon"></i
      ><i
        v-if="conversation.user.length > 3"
        title="Enlever de la conversation"
        class="circular times icon link"
        style=""
        @click="delParticipant(conversation, user)"
      ></i>
    </div>
    <div v-if="conversation.isManyToMany">
      <div class="spanner">
        <hr />
        <span>Communauté</span>
        <hr />
      </div>
      <div class="user" v-for="user in filtreAdd" :key="user.id">
        <img :src="user.picture_url" />
        <span>{{ user.username }} </span>
        <i
          title="Ajouter à la conversation"
          class="circular plus icon link"
          @click="newParticipant(conversation, user)"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Group",
  data() {
    return {
      search: ""
    };
  },
  computed: {
    ...mapGetters(["conversation", "users"]),
    filtreAdd() {
      if (this.search !== "") {
        return this.conversation.addUserList.filter(el =>
          el.username.toLowerCase().includes(this.search.toLowerCase())
        );
      } else {
        return this.conversation.addUserList;
      }
    },
    filtreGroup() {
      if (this.search !== "") {
        return this.conversation.user.filter(el =>
          el.username.toLowerCase().includes(this.search.toLowerCase())
        );
      } else {
        return this.conversation.user;
      }
    }
  },
  methods: {
    ...mapActions(["addParticipant", "removeParticipant"]),
    logConv(conversation) {
      console.log();
    },
    newParticipant(conversation, user) {
      let promise;

      this.conversation.addUserList.filter(u => u.username !== user.username);

      promise = this.addParticipant({ conversation, user });

      promise.finally(() => {
        console.log("Utilisateur ajouté !");
      });
    },
    delParticipant(conversation, user) {
      let promise;

      if (user.username === conversation.you.username) {
        this.conversation.user.filter(u => u.username !== user.username);
      }

      promise = this.removeParticipant({ conversation, user });

      promise.finally(() => {
        console.log("Utilisateur supprimé !");
      });
    }
  }
};
</script>

<style src="./Group.css" scoped />
