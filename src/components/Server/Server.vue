<template>
  <div style="margin: 50px auto;width: 400px">
    <div class="ui middle aligned center aligned grid">
      <div class="column">
        <h2 class="ui primary image header">
          <div class="content">
            Configuration
          </div>
        </h2>
        <form class="ui large form">
          <div class="ui attached segment">
            <div class="field">
              <div class="ui left icon input">
                <i class="server icon"></i>
                <input
                  type="text"
                  name="server"
                  v-model="endpoint"
                  placeholder="Endpoint"
                  @keyup.enter="updateServer"
                />
              </div>
            </div>
            <div
              class="ui fluid large primary submit button"
              @click="updateServer"
            >
              Enregistrer
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Server",
  data() {
    return {
      endpoint:
        localStorage.getItem("server") ||
        "wss://teach-vue-chat-server.glitch.me"
    };
  },
  methods: {
    updateServer() {
      localStorage.setItem("server", this.endpoint);
      window.location.href = "/";
    }
  }
};
</script>

<style scoped></style>
