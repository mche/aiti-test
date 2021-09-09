<template>
<h1>Официальный сайт забега</h1>
<p>Мероприятие посвящено и приурочено к Дню Физкультурника в нашем крае.</p>
<p>Организаторы приглашают принять участие всех желающих в возрасте от 14 лет.</p>
<p>Всех участников ждут призы и подарки. Главный приз за первые места в дистанциях - кроссовки!</p>

<p>Для принятия участия, пожалуйста, заполните регистрационную форму.
  На указанный вами Email будет выслано подтверждение. При регистрации Вы можете создать свой аккаунт(профиль).
</p>
<Profile v-if="!Profile && regForm" @cancel="regForm = false" />
<a v-show="!Profile && !regForm" class="btn-large" @click="regForm = true"><i class="material-icons left">add</i><span>Регистрация</span></a>

<h2>Комментарии программиста</h2>
   <ul class="collection">
      <li class="collection-item">Задание достаточно внятное. Только в данных было поле "date", его переименовал в "birth". Дата создания заявки - "createDate" (нет в исходном списке).</li>
      <li class="collection-item">Формы/маршруты/компоненты авторизации и регистрации сделал раздельно.</li>
      <li class="collection-item">Стилевой и компонентный фреймворк выбрал не основанный на Vue. Умение применять в Вуе ванильный js.</li>
      <li class="collection-item">На этом фреймворке адаптивный экран от 500 px. Своеобразная адаптивная таблица.</li>
      <li class="collection-item">После отправки формы регистрации сделал направление на страницу участников и там сразу виден этот новый зарегистрированный.</li>
      <li class="collection-item">Список участников. Сверх задания сделал показ/отключение колонок. Пагинация появляется сверх 3 строк. Можно менять сколько строк на странице. Конфиг колонок не стал помещать в стор.</li>
      <li class="collection-item">Datepicker до конца не локализовал.</li>
      <li class="collection-item">Можно было сделать компонент списка, из materialize-css чет не пошел, ну пусть будет простой.</li>

    </ul>

</template>

<script>
import { mapState } from 'vuex';
import Profile from "./Profile.vue";

function data(){
  return {
    regForm: false,
  };
}

const computed = {
  ...mapState({
    Profile: 'profile',
  }),
};

export default {
  data,
  computed,
  components:{Profile},
}
</script>