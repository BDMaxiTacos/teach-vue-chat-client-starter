<template>
  <div class="search-message">
    <div class="filter">
      <div class="ui fluid search">
        <div class="ui icon input">
          <input
            class="prompt"
            type="text"
            placeholder="Rechercher un message"
            v-model="search"
          />
          <i class="search icon"></i>
        </div>
        <div class="results"></div>
      </div>
    </div>
    <div class="conversations">
      <div class="conversation" v-for="conv in filtre" :key="conv.id">
        <div class="author" v-if="conv.search.length">
          <template v-if="conv.otherUsers.length === 1">
            <img :src="conv.otherUsers[0].picture_url" />
            <span>{{ conv.otherUsers[0].username }}</span>
          </template>
          <template v-else>
            <div class="avatar">
              <i class="users icon img"></i>
            </div>
            <span>{{ conv.title }}</span>
          </template>
        </div>
        <div class="messages" v-for="message in conv.search" :key="message.id">
          <div class="message">
            <div class="time">{{ message.posted_at }}</div>
            <div class="bubble">
              {{ message.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: "Search",
  data() {
    return {
      search: "",
    };
  },
  computed: {
    ...mapGetters(["user", "conversations"]),
    filtre() {
      let listconvs = [];
      if (this.search !== "") {
        listconvs = this.$store.getters.conversations.map(conv => ({
          ...conv,
          search: conv.messages.filter(
            el =>
              el.content &&
              el.content.toLowerCase().includes(this.search.toLowerCase())
          )
        }));
        console.log(listconvs);
      }

      return listconvs;
    }
  }
};
</script>

<style src="./Search.css" scoped />
