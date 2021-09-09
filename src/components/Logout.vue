<script>
export default {
  mounted(){
    this.$store.commit('profile');
    this.$router.replace({ path: '/' });
  }
}
</script>