<template>
  <div class="community">
    <div class="filter">
      <div class="ui fluid search">
        <div class="ui icon input">
          <input
            class="prompt"
            type="text"
            placeholder="Rechercher un utilisateur"
          />
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>
    </div>
    <!--    <div class="users">
      <div class="selected user">
        <img src="https://source.unsplash.com/7omHUGhhmZ0/100x100" /><span
          class=""
          >Bob</span
        >
      </div>
      <div class="user">
        <img src="https://source.unsplash.com/8wbxjJBrl3k/100x100" /><span
          class=""
          >Cha</span
        >
      </div>
      <div class="user">
        <img src="https://source.unsplash.com/FUcupae92P4/100x100" /><span
          class="available"
          >Derek</span
        >
      </div>
      <div class="user">
        <img src="https://source.unsplash.com/4U1x6459Q-s/100x100" /><span
          class=""
          >Emilio</span
        >
      </div>
      <div class="selected user">
        <img src="https://source.unsplash.com/3402kvtHhOo/100x100" /><span
          class="available"
          >Fabrice</span
        >
      </div>
      <div class="user">
        <img src="https://source.unsplash.com/OYH7rc2a3LA/100x100" /><span
          class=""
          >Gael</span
        >
      </div>
    </div>-->

    <div class="users">
      <div v-for="user in users" :key="user.id">
        <div class="user" @click="selectUser(user)" :class="{ selected: isSelected(user) }">
          <img :src="user.picture_url" />
          <span>{{ user.username }}</span>
        </div>
      </div>
    </div>

    <div class="actions">
      <button class="ui primary big button" @click="openConversation">
        <i class="conversation icon"></i>
        <span>
          Ouvrir la conversation (2)
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Community",
  data() {
    return {
      selected_users: []
    };
  },
  methods: {
    ...mapActions([
      "createOneToOneConversation",
      "createManyToManyConversation"
    ]),
    openConversation() {
      let promise;
      if (this.selected_users.length > 1) {
        promise = this.createManyToManyConversation(
          this.selected_users.map(user => user.username)
        );
      } else {
        promise = this.createOneToOneConversation(this.selected_users[0]);
      }

      promise.finally(() => {
        console.log("Conversation ouverte !");
      });
    },
    selectUser(user) {
      let index = this.selected_users.indexOf(user);
      if (index === -1){
        this.selected_users.push(user);
      } else {
        this.selected_users = this.selected_users.filter(el => el !== user);
      }
      return this.selected_users;
    },
    isSelected(user) {
      let index = this.selected_users.indexOf(user);
      return index !== -1;
    }
  },
  computed: {
    ...mapGetters(["users"]),

  }
};
</script>

<style src="./Community.css" scoped />
