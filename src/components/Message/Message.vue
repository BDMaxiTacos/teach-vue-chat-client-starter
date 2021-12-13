<template>
  <div>
    {{ msg.reactions }}
    <div v-if="isTime" class="time">{{ msg.posted_at }}</div>

    <div v-if="isMessage" class="message">
      <img
        title="Alice"
        src="https://source.unsplash.com/mK_sjD0FrXw/100x100"
      />
      <div class="bubble top bottom">{{ msg.content }}</div>
      <div class="reacts">
        <i v-if="msg.heart >= 1" title="Aimer" class="circular heart up outline icon">{{ msg.heart }}</i>
        <i v-if="msg.thumb >= 1" title="Pouce en l'air" class="circular thumbs up outline icon">{{ msg.thumb }}</i>
        <i v-if="msg.happy >= 1" title="Content" class="circular smile up outline icon">{{ msg.happy }}</i>
        <i v-if="msg.sad >= 1" title="Pas content" class="circular frown up outline icon">{{ msg.sad }}</i>
      </div>
      <div class="controls">
        <i title="Répondre" class="circular reply icon"></i>
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
      <div class="bubble top bottom">{{ msg.content }}</div>
      <div class="reacts"></div>
      <div class="controls">
        <i title="Supprimer" class="circular trash icon"></i
        ><i title="Editer" class="circular edit icon"></i
        ><i title="Répondre" class="circular reply icon"></i>
      </div>
    </div>

    <div v-if="isView" class="view">
      <img
        title="Vu par Alice à 01:36:39"
        src="https://source.unsplash.com/mK_sjD0FrXw/100x100"
      /><img
        title="Vu par Gael à 01:36:39"
        src="https://source.unsplash.com/OYH7rc2a3LA/100x100"
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
    }
  },
  methods: {
    ...mapActions(["reactMessage"]),
    reactToMessage(conversation_id, message_id, reaction) {
      this.reactMessage({ conversation_id, message_id, reaction });
    },
    getHeart(){
      return "HEART";
    },
    getThumb(){
      return "THUMB";
    },
    getHappy(){
      return "HAPPY";
    },
    getSad(){
      return "SAD";
    }
  }
};
</script>

<style src="./Message.css" scoped />
