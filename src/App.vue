<template>
  <div class="main">
    <nav>
      <div class="nav-wrapper">
        <ul class="menu left hide-on-med-and-down-00">
          <li><router-link to="/" class=" btn-floating btn-large white">
            <img alt="App logo" src="./assets/logo.png"/>
          </router-link></li>
          <!--li><router-link to="/profile/new">Зарегистрироваться</router-link></li-->
          <li :class="{'active': currentRoute.path === '/participants'}">
            <router-link to="/participants"><i class="material-icons left">group</i>Участники мероприятия</router-link>
          </li>
          <li v-if="!$store.state.profile" :class="{'active': currentRoute.path === '/auth'}">
            <router-link to="/auth"><i class="material-icons left">login</i>Авторизация</router-link>
          </li>
          <li v-else  :class="{'active': currentRoute.path === '/profile'}">
            <router-link to="/profile"><span class="material-icons material-icons-outlined">account_circle</span> {{$store.state.profile.name}}</router-link>
          </li>
        </ul>
        <ul class="right">
          <li v-show="$store.state.profile"><router-link to="/logout" class="center"><i class="material-icons">logout</i> Выход</router-link></li>
        </ul>
      </div>
    </nav>
    <div v-show="ready" class="container">
      <router-view></router-view>
      
    </div>
  </div>
</template>
<!-- ------------------------ конец шаблона --------- ------------------->
<script>
import loadData from "./data.js";
import { useRoute } from 'vue-router';
import { computed } from 'vue';

export default {
  data(){
    let vm = this;
    loadData.then(function (data) {
      vm.$store.commit('participants', data.users);
      vm.ready = true;
    });
    return {ready: false};
  },
  setup() {
    const currentRoute = computed(() => {
      return useRoute();
    });
    return { currentRoute };
  },
};
</script>

<!---- --------- ------------ Стили -------- ---  - - -- ---- - - --->
<style lang="scss">
@import "./main.scss";
@import "materialize-css/sass/materialize.scss";

nav .brand-logo {
  top: 0.3rem;
}

nav ul li.active {
    background-color: rgba(0, 0, 0, 0.3);
}

nav img {
  width: 3rem;
  vertical-align: middle;
  ///transform: rotateY(90deg);
}

.material-icons {
  vertical-align: middle;
}

.card-content {
  background: lighten($primary-color, 49%);
}
// карточка пароля
.card.card-content {
  background: lighten($primary-color, 40%);
}

select, input {
  & + label {
    color: $primary-color;
  }
}

select {
  display: block;
  border: none;
  outline: none;
  
  background-color: rgba(255, 255, 255, 0);
  overflow: auto;
  position: relative;
  z-index: 1;

  &:not(.datepicker-select) {
    border-bottom: 1px solid $input-border-color;
  }

  &.valid {
    border-bottom: 1px solid $input-success-color;
    box-shadow: 0 1px 0 0 $input-success-color;
  }
  &:focus {
    outline: none;
  }

  & + label {
    z-index: 0;
  }

 option {
   font-size: large;
 }
}
.select-dropdown.dropdown-trigger {
  display: none !important;

}

[type="checkbox"] {
  &, &:checked {
    & + span:before {
      border-right-color: $primary-color !important;
      border-bottom-color: $primary-color !important;
      //left: 7px;
    }
  }
  &:checked + span {
    color: $primary-color !important;
  }
}  

</style>
