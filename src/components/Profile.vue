<template>
  <h2>{{form.id ? 'Мой профиль' : 'Форма регистрации участника'}}</h2>
  <form ref="formRef" class="card col s12">
    <div class="card-content">
      <div class="row">
        <div class="input-field col s12 m6">
          <input id="name" v-model.trim="form.name" type="text" class="" 
            :class="form.name.length ? IsValidName ? 'valid' : 'invalid' : ''"/>
          <label for="name" class="active">ФИО</label>
          <span class="helper-text" data-error="Введите ФИО" data-success=""></span>
        </div>

        <div class="input-field col s12 m6">
          <input :ref="birthPicker" id="birth" type="text" class="validate"/>
          <label for="birth" class="active">Дата рождения</label>
        </div>
      </div>

      <div class="row">
        <div class="input-field col s12 m6">
          <input id="phone" v-model.trim="form.phone" type="text" class=""
            :class="form.phone.length ? IsValidPhone ? 'valid' : 'invalid' : ''" v-maska="'+7 ### ### ## ##'" @maska="phoneMaska($event)" />
          <label for="phone" :class="{'active': form.id}">Телефон</label>
          <span class="helper-text" data-error="Введите правильный телефон +7 xxx xxx xx xx" data-success=""></span>
        </div>
      
        <div class="input-field col s12 m6">
          <input id="email" type="email" v-model.trim="form.email" class="validate" />
          <label for="email"  :class="{'active': form.id}">Email</label>
          <span class="helper-text" data-error="Введите корректный email" data-success=""></span>
        </div>

      </div>


      <div class="row">
        <div class="input-field col s12 m6">
          <select ref="distance" id="distance" v-model="form.distance" class="validate" :class="{'valid':!!form.distance}">
            <option value="" disabled selected>Выберите подходящую вашему здоровью дистанцию</option>
            <option v-for="item in Distances" :key="item.val" :value="item.val">{{ item.title }}</option>
          </select>
          <label for="distance" :class="{'active':!!form.distance}">Дистанция забега</label>
        </div>

        <div class="input-field col s12 m6">
          <input id="payment" v-model="form.payment" type="text" class="validate"
            @keyup="changeMoney($event)" @keypress="changeMoney()" @blur="changeMoney()" >
          <label for="payment" class="active">Сумма взноса, руб</label>
          <span class="helper-text" data-error="" data-success="">Сумма может составлять от 100 до 10 000 руб.</span>
        </div>
      </div>

      <div class="row">
        <div class="col s12" :class="{'card card-content m6 offset-m3': !!form.confirm, 'm6': !!form.id}">
          <div v-show="!form.id" class="center">
            <span class="">Создать профиль </span>
            <label class="chip grey lighten-4">
              <input type="checkbox" v-model="form.confirm" :disabled="!form.email"/>
              <span>Да</span>
            </label>
            <span class="helper-text" data-error="" data-success=""></span>
          </div>
          <div v-show="!!form.confirm || !!form.id">
            <h6 v-show="!form.id">Ваш логин: <span class="chip">{{ form.email }}</span> </h6>
            <div class="input-field passwd">
              <input id="password" :type="visibilityPasswd ? 'text' : 'password'" v-model="form.passwd" class=""
                :class="form.passwd.length ? IsValidPasswd ? 'valid' : 'invalid' : ''" >
              <label for="password" :class="{'active': form.passwd.length}">Укажите пароль для вашего профиля</label>
              <span class="helper-text" data-error="любые символы от 3 до 10 знаков включительно" data-success=""></span>
              <a @click="visibilityPasswd = !visibilityPasswd" href="javascript:" class="hoverable">
                <i class="material-icons">{{visibilityPasswd ? 'visibility_off' : 'visibility'}}</i>
              </a>
            </div>
          </div>
        </div>
        <div v-show="saveError" class="chip red-text center">{{saveError}}</div>
      </div>
      <div class="card-action">
        <Preloader v-if="isProgress" />
        <a @click="Save" class="btn" :class="{'disabled':!IsValidForm || saveError || isProgress}">
          <span v-if="!form.id"><i class="material-icons right">send</i>
          Отправить заявку<span v-show="form.confirm"> и зарегистрироваться</span>
          </span>
          <span v-else><i class="material-icons material-icons-outlined left">border_color</i> Сохранить</span>
        </a>
        <a class="btn right red lighten-2" @click="Cancel">Отмена</a>
      </div>
    </div>
  </form>
</template>

<script>
import M from "materialize-css/dist/js/materialize.js";
import re from "./re.js";
import Preloader from "./Preloader.vue";
//import "materialize-css/js/cash.js";
//import "materialize-css/js/forms.js";
//import { ref, computed } from "vue";
///import dayjs from "dayjs";

const datePickerI18n = {
  monthsShort: [
    "янв.",
    "фев.",
    "мар.",
    "апр.",
    "май",
    "июнь",
    "июль",
    "авг.",
    "сент.",
    "окт.",
    "нояб.",
    "дек.",
  ],
  weekdaysShort: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
};

const distances = [
  {val: 3, title: "3 км"},
  {val: 5, title: "5 км"},
  {val: 10, title: "10 км (справка от врача обязательна)"},
];

const props = {
  profile: {
    type: Object,
    default: () => {
      return { birth: "2000-03-15", distance:0, phone:'', rawPhone:'', name:'', email:'', passwd:'', payment:300, confirm: false,};
    },
  },
};

function data(){
  return {
    form: this.$store.state.profile || this.profile,
    saveError: undefined,
    isProgress: undefined,
    visibilityPasswd: false,
  };
}

const methods = {
  birthPicker(el) {
    let vm = this;
    let maxDate = new Date();
    maxDate = new Date(maxDate.setYear(maxDate.getYear() - 14 + 1900));
    // очень точное вычисление доп. 5 дней
    maxDate = new Date(maxDate.setDate(maxDate.getDate() + 5));
    M.Datepicker.init(el, {
      autoClose: true,
      defaultDate: new Date(vm.form.birth),
      setDefaultDate: true,
      i18n: datePickerI18n,
      format: "dd mmm yyyy",
      firstDay: 1,
      maxDate,
      onSelect: (date) => {
        vm.form.birth = date.toISOString();
      },
    });
  },
  phoneMaska(event){
    this.form.rawPhone = event.target.dataset.maskRawValue;
  },
  changeMoney(event){
    if (event && re.nonDigit.test(this.form.payment.toString())) {
      event.preventDefault();
      this.form.payment = this.form.payment.toString().replace(re.nonDigit, '');
      return false;
    }
    this.form.payment = this.form.payment.toString().replace(re.nonDigit, '');
    let sum = Math.max(Math.min(this.form.payment, 10000), 100);
    if (!isNaN(sum)) this.form.payment = sum;
  },
  Save(){
    this.isProgress = true;
    this.form.createDate = this.form.createDate || new Date();
    this.form.phone = '+7'+this.form.rawPhone;
    let toast = !this.form.id;
    this.$store.dispatch('Register', this.form).then((success) => {
      if (toast) M.toast({html: 'Поздравляем! Ваша заявка сохранена.'});
      else M.toast({html: 'Профиль сохранен.'});

      if (this.$router.currentRoute.path !== '/participants') this.$router.push('/participants');
      this.$emit('on-register');
    }, (err) => {
      this.saveError = err;
      this.isProgress = false;
    });
  },
  Cancel(){
    if (this.hasOnCancel) this.$emit('on-cancel');
    else this.$router.back();
    //if (this.$router.currentRoute.path !== '/participants') this.$router.push('/participants');
  },

};

const computed = {
  Distances(){
    return distances;
  },
  IsValidName(){
    return re.name.test(this.form.name.toString());
  },
  IsValidPhone(){
    let phone = this.form.rawPhone;
    return phone && phone.length === 10;
  },
  IsValidEmail(){
    return re.email.test(this.form.email.toString());
  },
  IsValidPasswd(){
    let passwd = this.form.passwd;
    return passwd.length && (passwd.length > 2 && passwd.length < 11);
  },
  IsValidDistance(){
    return !!this.form.distance;
  },
  IsValidForm(){
    this.saveError = undefined;
    return this.IsValidName
      && this.IsValidPhone
      && this.IsValidEmail
      && (!this.form.confirm || this.IsValidPasswd)
      && this.IsValidDistance;
  },
  hasOnCancel(){
    return this.$attrs  && Boolean(this.$attrs['onOn-cancel']);
  }
};

const components = {Preloader};
const emits = ['onRegister', 'onCancel'];

export default {
  emits,
  props,
  data,
  methods,
  computed,
  components,
};
</script>

<!-- - -- ---- ------ styles - -------- ----- -->
<style lang="scss" scoped>
@import "../main.scss";

.input-field.passwd a {
  position: absolute;
  top: 0.5rem;
  right: 0;
  color: $primary-color;
}

</style>
