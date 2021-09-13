import { createStore } from 'vuex';
import orderBy from "lodash.orderby";

function id(){
  return Math.round(Math.random()*1e10);
}

const store = createStore({
  state: {
    participants: [],
    profile: undefined,// авторизованный профиль
  },
  mutations: {
    participants(state, users){
      users.forEach(u => {u.id = u.id || id()});
      state.participants.push(...users);
    },
    register(state, item){
      state.participants.push(item);
    },
    profile(state, profile){
      state.profile = profile;
    },
  },
  actions: {
    /****
     * Регистрация и редактирование профиля
     */
    Register({ commit, getters }, data){
      return new Promise((resolve, reject) => {
        // имитация бэка
        setTimeout(() => {
          if (data.id) {/// изменение профиля
            commit('profile', data);
            resolve(data);
            return;
          }
          
          if (getters.CheckEmail(data.email)) {
            reject('Такой Email уже зарегистрирован, попробуйте авторизоваться');
            return;
          }

          if (data.passwd) {
            data.id = id();
            /// commit('profile', data); можно сразу залогинить 
          }

          commit('register', data);

          resolve(data);
        }, 2000);
      });
    },
    /***
     * Вход в систему
     */
    Auth({ commit, state  }, data){
      return new Promise((resolve, reject) => {
        // имитация бэка
        setTimeout(() => {
          let success = state.participants.find((item)=>item.email === data.email && item.passwd === data.passwd);
          if (success) {
            commit('profile', success);
            resolve(success);
          } else reject('Неверный логин или пароль');
        }, 2000);
      });
    },
  },
  getters: {
    CheckEmail: state => (email) => {
      return state.participants.find((item)=>item.email === email);
    },
    OrderBy: state => (field, order) => {
      return orderBy(state.participants, [field], [order || 'desc']);
    },
  },
});

fetch('data.json')
    .then((response) => response.json())
    .then(data => {
        store.commit('participants', data.users)  
      })
    .catch(err => console.log('fetch data.json error:', err))
  

export default store;
