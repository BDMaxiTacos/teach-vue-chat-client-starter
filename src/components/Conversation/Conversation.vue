<template>
  <div class="conversation">
    <div class="conversation-header">
      <a class="avatar">
        <span v-if="conversation.otherUsers.length > 1">
          <i class="users icon img"> </i>
        </span>
        <img
          v-if="conversation.otherUsers.length === 1"
          :src="conversation.otherUsers[0].picture_url"
          class="ui circular image"
          :alt="conversation.otherUsers.username"
        />
      </a>

      <div class="title">
        <div class="ui compact">
          <i class="icon" :class="{ circle: conversation.userConnected }"></i>
          <span>
            {{ conversation.title }}
          </span>

          <div class="ui simple dropdown item">
            <i class="vertical ellipsis icon"></i>

            <div class="menu">
              <div v-if="true" class="item">
                <i class="ui icon paint brush"></i>
                Modifier le thème
              </div>
              <div v-if="true" class="item">
                <i class="ui icon edit"></i>
                Modifier le titre
              </div>
              <div v-if="true" class="item">
                <i class="ui icon volume bell slash"></i>
                Mettre en sourdine
              </div>
              <div v-if="true" class="item">
                <i class="ui icon volume bell"></i>
                Rétablir les notifications
              </div>
              <div class="item" @click="groupPanel = !groupPanel">
                <i class="ui icon users"></i>
                Gérer les participants
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="conversation-container">
      <div class="conversation-main">
        <div class="conversation-body" id="scroll">
          <div class="wrapper">
            <message
              v-for="item in messages"
              :key="item.id"
              :type="item.type"
              :msg="item.msg"
              :seen="item.seen"
              @setReply="setReply($event)"
              @setEdit="setEdit($event)"
            ></message>
          </div>
        </div>
        <!--        <div class="typing">-->
        <!--          <div class="wrapper">-->
        <!--            Alice est en train d'écrire...-->
        <!--          </div>-->
        <!--        </div>-->
        <div class="conversation-footer">
          <div class="wrapper">
            <p v-if="replyTo">
              <i
                title="Abandonner"
                class="circular times small icon link"
                @click="resetReply()"
              ></i>
              Répondre à {{ replyTo.from }} :
              <span>
                {{ replyTo.content }}
              </span>
            </p>
            <p v-else-if="edit">
              <i
                title="Abandonner"
                class="circular times small icon link"
                @click="resetEdit()"
              ></i>
              Edition
            </p>

            <div class="ui fluid search">
              <div class="ui icon input">
                <input
                  v-model="msgInWrite"
                  class="prompt"
                  type="text"
                  placeholder="Rédiger un message"
                  @keyup.enter="send()"
                />
                <i class="send icon link" @click="send()"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="conversation-sidebar" v-if="groupPanel">
        <Group />
      </div>
    </div>
  </div>
</template>

<script>
import Group from "@/components/Group/Group";
import Message from "@/components/Message/Message";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Conversation",
  components: { Group, Message },
  data() {
    return {
      groupPanel: false,
      msgInWrite: "",
      edit: null,
      replyTo: null
    };
  },
  // mounted() {
  //   this.scrollBottom();
  // },
  // updated() {
  //   this.scrollBottom();
  // },
  computed: {
    ...mapGetters(["user", "conversation"]),
    messages() {
      let listMessages = [];
      let previousUser = null;
      this.conversation.messages.forEach(msg => {
        if (
          (previousUser == this.user.username &&
            msg.from != this.user.username) ||
          (previousUser != this.user.username && msg.from == this.user.username)
        ) {
          listMessages.push({ type: "time", msg: msg });
        }
        previousUser = msg.from;
        if (msg.from != this.user.username) {
          listMessages.push({ type: "message", msg: msg });
        }
        if (msg.from == this.user.username) {
          listMessages.push({ type: "message mine", msg: msg });
        }
        let listView = [];
        for (const user in this.conversation.seen) {
          if (this.conversation.seen[user].message_id == msg.id) {
            listView.push(user);
          }
        }
        if (listView.length != 0) {
          listMessages.push({ type: "view", seen: listView });
        }
      });
      return listMessages;
    }
  },
  methods: {
    ...mapActions([
      "postMessage",
      "replyMessage",
      "seeConversation",
      "editMessage"
    ]),
    scrollBottom() {
      setTimeout(() => {
        let scrollElement = document.querySelector("#scroll");
        if (scrollElement) {
          scrollElement.scrollTop = document.querySelector(
            "#scroll"
          ).scrollHeight;
        }
      }, 0);
    },
    send() {
      if (this.replyTo == null && this.edit == null) {
        this.sendMsg();
      } else {
        if (this.edit != null) {
          this.editMsg();
        } else if (this.replyTo != null) {
          this.replyMsg();
        }
      }
    },
    sendMsg() {
      const promise = this.postMessage({
        conversation: this.conversation,
        content: this.msgInWrite
      });

      promise.finally(() => {
        this.msgInWrite = "";
      });
    },
    editMsg() {
      const promise = this.editMessage({
        conversation: this.conversation,
        message_id: this.edit.id,
        content: this.msgInWrite
      });

      promise.finally(() => {
        this.msgInWrite = "";
        this.edit = null;
      });
    },
    setEdit(id) {
      this.edit = this.conversation.messages[id];
    },
    resetEdit() {
      this.edit = null;
    },
    replyMsg() {
      const promise = this.replyMessage({
        conversation: this.conversation,
        message_id: this.replyTo.id,
        content: this.msgInWrite
      });

      promise.finally(() => {
        this.msgInWrite = "";
        this.replyTo = null;
      });
    },
    setReply(id) {
      this.replyTo = this.conversation.messages[id];
    },
    resetReply() {
      this.replyTo = null;
    }
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    conversation(newConversation, oldConversation) {
      if (
        oldConversation.messages.length !== newConversation.messages.length &&
        newConversation.messages.length > 0
      ) {
        this.scrollBottom();
        this.seeConversation({
          conversation_id: newConversation.id,
          message_id:
            newConversation.messages[newConversation.messages.length - 1].id
        });
      }
    }
  }
};
</script>

<style src="./Conversation.css" scoped />
