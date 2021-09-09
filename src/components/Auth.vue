<template>
  <h2 class="center">Авторизация участника</h2>
  <div class="row">
    <form ref="formRef" class="card col s12 m6 offset-m3 xl4 offset-xl4">
      <div class="card-content">
        <div class="row">
          <div class="input-field col s12">
            <input id="email" v-model.trim="form.email" type="text" class="" />
            <label for="email" class="">Логин (Email)</label>
            <!--span class="helper-text" data-error="Введите ФИО" data-success=""></span -->
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input id="password" type="password" v-model="form.passwd" >
            <label for="password" class="">Пароль профиля</label>
          </div>
        </div>
        <div v-show="authError" class="chip red-text center">{{authError}}</div>
      </div>
      <div class="card-action center">
        <Preloader v-if="isProgress" />
        <a href="javascript:" @click="Auth" class="btn" :class="{'disabled':!IsValidForm || authError || isProgress}">Вход</a>
        
      </div>
    </form>
  </div>
</template>

<script>
import re from "./re.js";
import Preloader from "./Preloader.vue";
import "materialize-css/js/cash.js";
import "materialize-css/js/anime.min.js";
import "materialize-css/js/toasts.js";
import M from "materialize-css/dist/js/materialize.js";

function data(){
  return {
    form: {
      email: '',
      passwd: '',
    },
    authError: undefined,
    isProgress: undefined,
  };
}

const methods = {
  Auth(){
    this.isProgress = true;
    this.$store.dispatch('Auth', this.form).then((success) => {
      M.toast({html: 'Успешный вход!'});
      this.$router.replace('/profile');
    }, (err) => {
      this.authError = err;
      this.isProgress = false;
    });
  },
};

const computed = {
  IsValidEmail(){
    return re.email.test(this.form.email.toString());
  },
  IsValidPasswd(){
    return !!this.form.passwd.length && this.form.passwd.length > 2;
  },
  IsValidForm(){
    this.authError = undefined;
    return this.IsValidEmail
      && this.IsValidPasswd;
  },
};

const components = {Preloader};

export default {
  data,
  methods,
  computed,
  components,
};

</script>

<!-- - -- ---- ------ styles - -------- ----- -->
<style lang="scss" scoped>
@import "../main.scss";

.card {
  background: lighten($primary-color, 49%);
}

.preloader-wrapper {
  position: absolute;
}
</style>