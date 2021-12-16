import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authenticating: false,
    user: {
      username: null,
      token: null,
      picture_url: null
    },
    users: [],
    conversations: [],
    currentConversationId: null,
    usersAvailable: []
  },
  getters: {
    authenticating(state) {
      return state.authenticating;
    },
    authenticated(state) {
      return state.user.token !== null;
    },
    user(state) {
      return state.user;
    },
    users(state) {
      return state.users.map(user => ({
        ...user
        //TODO
      }));
    },
    conversations(state) {
      return state.conversations
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .map(conversation => {
          let connected = state.users.some(
            u =>
              conversation.participants.includes(u.username) &&
              u.awake &&
              u.username !== state.user.username
          );

          let tabpart = conversation.participants;

          let convuser = [];
          tabpart.forEach(el => {
            convuser.push(state.users.find(u => el === u.username));
          });

          let lastmsg,
            lengthmsgs = conversation.messages.length;
          if (lengthmsgs >= 1) {
            lastmsg = conversation.messages[lengthmsgs - 1].content;
          }
          let boolSeen;
          if (convuser.find(u => state.user.username === u.username)) {
            boolSeen =
              conversation.messages.length > 0 &&
              conversation.seen[state.user.username].message_id !==
                conversation.messages[conversation.messages.length - 1].id;
          }

          if (!conversation.title) {
            tabpart = tabpart.filter(s => s !== state.user.username);
            conversation.title = tabpart.join(", ");
          }
          return {
            ...conversation,
            you: state.user,
            userConnected: connected,
            user: convuser,
            otherUsers: convuser.filter(
              u => u.username !== state.user.username
            ),
            addUserList: state.users.filter(user => !convuser.includes(user)),
            lastMessage: lastmsg,
            isNotSeen: boolSeen,
            isManyToMany: conversation.type === "many_to_many",
            messages: conversation.messages.map((message, index, tabMsgs) => ({
              ...message,
              heart: Object.values(message.reactions).filter(
                react => react === "HEART"
              ).length,
              thumb: Object.values(message.reactions).filter(
                react => react === "THUMB"
              ).length,
              happy: Object.values(message.reactions).filter(
                react => react === "HAPPY"
              ).length,
              sad: Object.values(message.reactions).filter(
                react => react === "SAD"
              ).length,
              isTop:
                message.id === 0 ||
                (tabMsgs[index - 1] &&
                  tabMsgs[index - 1].from !== message.from),
              isMiddle:
                tabMsgs[index - 1] &&
                tabMsgs[index - 1].from === message.from &&
                tabMsgs[index + 1] &&
                tabMsgs[index + 1].from === message.from,
              isBottom:
                message.id === tabMsgs[tabMsgs.length - 1].id ||
                (tabMsgs[index + 1] &&
                  tabMsgs[index + 1].from !== message.from),
              isLast:
                !tabMsgs[index + 1] || tabMsgs[index + 1].from !== message.from
            }))
          };
        });
    },
    conversation(state, getters) {
      return getters.conversations.find(
        el => el.id === state.currentConversationId
      );
    }
  },
  mutations: {
    syncCurrentConversation(state, conversationId) {
      state.currentConversationId = conversationId;
    },
    setAuthenticating(state, authenticating) {
      state.authenticating = authenticating;
    },
    setUser(state, { username, token, picture_url }) {
      Vue.set(state.user, "username", username);
      Vue.set(state.user, "token", token);
      Vue.set(state.user, "picture_url", picture_url);
    },
    setUsers(state, users) {
      state.users = users;
    },
    setConversations(state, convs) {
      state.conversations = convs;
    },
    upsertUser(state, { user }) {
      const localUserIndex = state.users.findIndex(
        _user => _user.username === user.username
      );

      if (localUserIndex !== -1) {
        Vue.set(state.users, localUserIndex, user);
      } else {
        state.users.push({
          ...user
        });
      }
    },
    upsertConversation(state, { conversation }) {
      const localConversationIndex = state.conversations.findIndex(
        findConv => findConv.id === conversation.id
      );

      if (localConversationIndex !== -1) {
        Vue.set(state.conversations, localConversationIndex, conversation);
      } else {
        state.conversations.push({
          ...conversation
        });
      }

      state.conversations = state.conversations.filter(conv =>
        conv.participants.includes(state.user.username)
      );

      if (
        conversation.isNotSeen &&
        conversation.seen[state.user.username] !== -1
      ) {
        conversation.seen[state.user.username].message_id =
          conversation.messages[conversation.messages.length - 1].id;
      }
    },
    upsertMessage(state, { conversation_id, message }) {
      const localConversationIndex = state.conversations.findIndex(
        findConv => findConv.id === conversation_id
      );

      let conversation = state.conversations.find(
        findConv => findConv.id === conversation_id
      );

      conversation.isNotSeen =
        conversation.messages.length > 0 &&
        conversation.seen[state.user.username].message_id !== message.id;

      const localMessageIndex = state.conversations[
        localConversationIndex
      ].messages.findIndex(findMsg => findMsg.id === message.id);

      if (localMessageIndex !== -1) {
        Vue.set(
          state.conversations[localConversationIndex].messages,
          localMessageIndex,
          message
        );
      } else {
        state.conversations[localConversationIndex].messages.push({
          ...message
        });
      }

      Vue.set(state.conversations, localConversationIndex, conversation);
    },
    updateUsers(state, { usernames }) {
      state.users.forEach(awakeU => {
        if (!usernames.includes(awakeU.username)) {
          awakeU.awake = false;
        }
      });

      usernames.forEach(username => {
        let user = state.users.filter(_user => _user.username === username)[0];
        if (user) {
          const localUserIndex = state.users.findIndex(
            _user => _user.username === user.username
          );

          user.awake = true;

          if (localUserIndex !== -1) {
            Vue.set(state.users, localUserIndex, user);
          } else {
            state.users.push({
              ...user
            });
          }
        }
      });
    },
    deleteMsg(state, { conversation_id, message_id }) {
      const localConversationIndex = state.conversations.findIndex(
        findConv => findConv.id === conversation_id
      );

      if (localConversationIndex !== -1) {
        const localMessageIndex = state.conversations[
          localConversationIndex
        ].messages.findIndex(findMsg => findMsg.id === message_id);

        if (localMessageIndex !== -1) {
          Vue.set(
            state.conversations[localConversationIndex].messages[
              localMessageIndex
            ],
            "deleted",
            true
          );
        }
      }
    }
  },
  actions: {
    authenticate({ commit, dispatch }, { username, password }) {
      if (!username || !password) {
        return;
      }
      commit("setAuthenticating", true);
      Vue.prototype.$client
        .authenticate(username, password)
        .then(user => {
          commit("setUser", user);
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);

          dispatch("initializeAfterAuthentication");
        })
        .catch(() => {
          alert("Erreur d'authentification !");
        })
        .finally(() => {
          commit("setAuthenticating", false);
        });
    },
    deauthenticate() {
      localStorage.removeItem("password");
      window.location.reload();
    },
    initializeAfterAuthentication({ dispatch }) {
      dispatch("fetchUsers");
      dispatch("fetchConversations");
    },
    fetchUsers({ commit }) {
      Vue.prototype.$client.getUsers().then(({ users }) => {
        commit("setUsers", users);
      });
    },
    fetchConversations({ commit }) {
      Vue.prototype.$client.getConversations().then(({ conversations }) => {
        commit("setConversations", conversations);
      });
    },
    createOneToOneConversation({ commit }, username) {
      const promise = Vue.prototype.$client.getOrCreateOneToOneConversation(
        username
      );

      promise.then(({ conversation }) => {
        commit("upsertConversation", {
          conversation
        });

        router.push({
          name: "Conversation",
          params: { id: conversation.id }
        });
      });

      return promise;
    },
    createManyToManyConversation({ commit }, usernames) {
      const promise = Vue.prototype.$client.createManyToManyConversation(
        usernames
      );

      promise.then(({ conversation }) => {
        commit("upsertConversation", {
          conversation
        });

        router.push({
          name: "Conversation",
          params: { id: conversation.id }
        });
      });

      return promise;
    },
    addParticipant({ commit }, { conversation, user }) {
      const promise = Vue.prototype.$client.addParticipant(
        conversation.id,
        user.username
      );

      promise.then(({ conversation }) => {
        commit("upsertConversation", {
          conversation
        });
      });

      return promise;
    },
    removeParticipant({ commit }, { conversation, user }) {
      const promise = Vue.prototype.$client.removeParticipant(
        conversation.id,
        user.username
      );

      if (conversation.you.username === user.username) {
        router.push({
          name: "Community"
        });
      }

      promise.then(({ conversation }) => {
        commit("upsertConversation", {
          conversation
        });
      });

      return promise;
    },
    postMessage({ commit }, { conversation, content }) {
      const promise = Vue.prototype.$client.postMessage(
        conversation.id,
        content
      );

      return promise;
    },
    replyMessage({ commit }, { conversation, message_id, content }) {
      const promise = Vue.prototype.$client.replyMessage(
        conversation.id,
        message_id,
        content
      );

      return promise;
    },
    editMessage({ commit }, { conversation, message_id, content }) {
      const promise = Vue.prototype.$client.editMessage(
        conversation.id,
        message_id,
        content
      );

      return promise;
    },
    seeConversation({ commit }, { conversation_id, message_id }) {
      const promise = Vue.prototype.$client.seeConversation(
        conversation_id,
        message_id
      );

      return promise;
    },
    reactMessage({ commit }, { conversation_id, message_id, reaction }) {
      const promise = Vue.prototype.$client.reactMessage(
        conversation_id,
        message_id,
        reaction
      );

      return promise;
    },
    deleteMessage({ commit }, { conversation_id, message_id }) {
      const promise = Vue.prototype.$client.deleteMessage(
        conversation_id,
        message_id
      );

      return promise;
    }
  }
});
