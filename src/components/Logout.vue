<template>
    
</template>

<script>
import M from "materialize-css/dist/js/materialize.js";

export default {
  mounted(){
    M.toast({html: 'Вы вышли из профиля'});
    this.$store.commit('profile');
    this.$router.replace({ path: '/' });
  }
}
</script>