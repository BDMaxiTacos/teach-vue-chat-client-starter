<template>
  <div class="sidebar">
    <div class="user">
      <div class="user-picture">
        <img :src="user.picture_url" class="ui circular image" />
      </div>

      <div class="user-info">
        <div class="user-info-pseudo">{{ user.username }}</div>

        <div class="user-info-status ui simple dropdown">
          <div class="available text">
            En ligne
          </div>
          <i class="dropdown icon"> </i>
          <div class="menu">
            <div class="item" @click="deauthenticate">
              <i class="logout icon"> </i>
              Déconnexion
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="menu">
      <div class="blue button" @click="openCommunity">
        <i class="users icon"> </i>
        <br />
        <span>Communauté</span>
      </div>
      <div v-if="true" class="blue button" @click="openMessageSearch">
        <i class="search icon"> </i>
        <br />
        <span>Messages</span>
      </div>
      <div class="blue button" @click="openGroupDevInfo">
        <i class="search icon"> </i>
        <br />
        <span>GroupeDev</span>
      </div>
    </div>

    <div class="conversations">
      <div class="conversation-search">
        <div class="ui fluid search">
          <div class="ui icon input">
            <input
              class="prompt"
              placeholder="Rechercher une conversation"
              type="text"
              v-model="search"
            />
            <i class="search icon"> </i>
          </div>
        </div>
      </div>
      <div
        v-for="conversation in filtre"
        :key="conversation.id"
        class="conversation"
        :class="{
          selected: isSelected === conversation.id,
          available: conversation.userConnected && !conversation.boolSeen,
          new: conversation.isNotSeen
        }"
        title=""
        @click="openConversation(conversation.id)"
      >
        <a class="avatar">
          <span v-if="conversation.user.length > 1">
            <i class="users icon img"> </i>
          </span>
          <img v-if="conversation.user.length === 1" :src="conversation.user[0].picture_url" class="ui circular image" />
        </a>
        <div class="content">
          <div class="metadata">
            <div class="title">
              <i
                v-if="conversation.userConnected || conversation.isNotSeen"
                class="ui small icon circle"
              >
              </i>
              <span v-if="conversation.titre.length === 0">
                {{ conversation.title }}
              </span>
              <span v-else>
                {{ conversation.titre }}
              </span>
            </div>
            <span class="time">
              {{ new Date(conversation.updated_at).toLocaleString() }}
            </span>
          </div>
          <div class="text">
            {{ conversation.lastMessage }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Sidebar",
  data() {
    return {
      search: "",
      isSelected: undefined
    };
  },
  methods: {
    ...mapActions(["deauthenticate"]),
    openCommunity() {
      router.push({ name: "Community" });
    },
    openMessageSearch() {
      router.push({ name: "Search" });
    },
    openGroupDevInfo() {
      router.push({ name: "GroupDev" });
    },
    openConversation(id) {
      router.push({ name: "Conversation", params: { id } });
      this.isSelected = id;
    }
  },
  computed: {
    ...mapGetters(["user", "conversations"]),
    filtre() {
      if (this.search !== "") {
        return this.$store.getters.conversations.filter(el =>
          el.title.toLowerCase().includes(this.search.toLowerCase())
        );
      } else {
        return this.$store.getters.conversations;
      }
    }
  }
};
</script>

<style scoped src="./Sidebar.css" />
