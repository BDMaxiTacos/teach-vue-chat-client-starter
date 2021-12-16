<template>
  <div>
    <div v-if="isTime" class="time">{{ msg.posted_at }}</div>

    <div v-if="isMessage" class="message">
      <img :title="getUser.username" :src="getUser.picture_url" />
      <div class="bubble top bottom">
        <p v-if="msg.reply_to" class="reply_content">
          {{ msg.reply_to.content }}
        </p>
        {{ msg.content }}
      </div>
      <div class="reacts">
        <i
          v-if="msg.heart >= 1"
          title="Aimer"
          class="circular heart up outline icon"
          >{{ msg.heart }}</i
        >
        <i
          v-if="msg.thumb >= 1"
          title="Pouce en l'air"
          class="circular thumbs up outline icon"
          >{{ msg.thumb }}</i
        >
        <i
          v-if="msg.happy >= 1"
          title="Content"
          class="circular smile up outline icon"
          >{{ msg.happy }}</i
        >
        <i
          v-if="msg.sad >= 1"
          title="Pas content"
          class="circular frown up outline icon"
          >{{ msg.sad }}</i
        >
      </div>
      <div class="controls">
        <i
          title="Répondre"
          class="circular reply icon"
          @click="$emit('setReply', msg.id)"
        ></i>
        <span class="react">
          <i
            title="Aimer"
            class="circular heart outline icon"
            @click="reactToMessage(conversation.id, msg.id, getHeart())"
          ></i>
          <i
            title="Pouce en l'air"
            class="circular thumbs up outline icon"
            @click="reactToMessage(conversation.id, msg.id, getThumb())"
          ></i>
          <i
            title="Content"
            class="circular smile outline icon"
            @click="reactToMessage(conversation.id, msg.id, getHappy())"
          ></i>
          <i
            title="Pas content"
            class="circular frown outline icon"
            @click="reactToMessage(conversation.id, msg.id, getSad())"
          ></i>
        </span>
      </div>
    </div>

    <div v-if="isMessageMine" class="message mine">
      <div class="bubble top bottom">
        <p v-if="msg.reply_to" class="reply_content">
          {{ msg.reply_to.content }}
        </p>
        {{ msg.content }}
      </div>
      <div class="reacts">
        <i
          v-if="msg.heart >= 1"
          title="Aimer"
          class="circular heart up outline icon"
          >{{ msg.heart }}</i
        >
        <i
          v-if="msg.thumb >= 1"
          title="Pouce en l'air"
          class="circular thumbs up outline icon"
          >{{ msg.thumb }}</i
        >
        <i
          v-if="msg.happy >= 1"
          title="Content"
          class="circular smile up outline icon"
          >{{ msg.happy }}</i
        >
        <i
          v-if="msg.sad >= 1"
          title="Pas content"
          class="circular frown up outline icon"
          >{{ msg.sad }}</i
        >
      </div>
      <div class="controls">
        <i
          title="Supprimer"
          class="circular trash icon"
          @click="removeMessage(conversation.id, msg.id)"
        ></i
        ><i title="Editer" class="circular edit icon"></i
        ><i title="Répondre" class="circular reply icon"></i>
      </div>
    </div>

    <div v-if="isView" class="view">
      <img
        v-for="user in getSeen"
        :key="user.id"
        :title="user.username"
        :src="user.picture_url"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Message",
  props: {
    type: { required: true, type: String },
    msg: { default: () => ({}), type: Object },
    seen: { default: () => [], type: Array }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["conversation", "user"]),
    isTime() {
      return this.type == "time";
    },
    isMessage() {
      return this.type == "message";
    },
    isMessageMine() {
      return this.type == "message mine";
    },
    isView() {
      return this.type == "view";
    },
    getUser() {
      return this.$store.getters.users.find(el => el.username == this.msg.from);
    },
    getSeen() {
      return this.$store.getters.users.filter(el =>
        this.seen.includes(el.username)
      );
    }
  },
  methods: {
    ...mapActions(["reactMessage", "deleteMessage"]),
    reactToMessage(conversation_id, message_id, reaction) {
      this.reactMessage({ conversation_id, message_id, reaction });
    },
    removeMessage(conversation_id, message_id) {
      this.deleteMessage({ conversation_id, message_id });
    },
    getHeart() {
      return "HEART";
    },
    getThumb() {
      return "THUMB";
    },
    getHappy() {
      return "HAPPY";
    },
    getSad() {
      return "SAD";
    }
  }
};
</script>

<style src="./Message.css" scoped />
