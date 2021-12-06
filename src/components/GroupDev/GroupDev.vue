<template>
  <div class="group">
    <div class="head">
      <i class="users icon"></i>
      <span>Groupe 6 : Qui n’a pas encore de groupe ?</span>
    </div>
    <div class="spanner">
      <hr />
      <span>Participants</span>
      <hr />
    </div>
    <div class="user">
      <img src="https://source.unsplash.com/mK_sjD0FrXw/100x100"/>
	  <span>Bercy Zoé<br /><i class="nickname"></i></span>
	  <i title="Modifier le surnom" class="circular quote left link icon"></i>
    </div>
    <div class="user">
      <img src="https://source.unsplash.com/7omHUGhhmZ0/100x100" />
	  <span>Jacquemard Tristan<br /><i class="nickname"></i></span>
	  <i title="Modifier le surnom" class="circular quote left link icon"></i>
    </div>
    <div class="user">
      <img src="https://source.unsplash.com/rjm8go9rL8Y/100x100" />
	  <span>Reversat Vincent<br /><i class="nickname"></i></span>
	  <i title="Modifier le surnom" class="circular quote left link icon"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "GroupDev",
  data() {
    return {
      search: ""
    };
  },
  computed: {
    ...mapGetters([])
  },
  methods: {
    ...mapActions([])
  }
};
</script>

<style src="./GroupDev.css" scoped />
