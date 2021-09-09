import { createApp } from "vue";
import App from "./App.vue";
import store from "./store.js";
import router from "./router.js";
import Maska from 'maska';


const app = createApp(App);
app.use(router);
app.use(store);
app.use(Maska);
app.mount("#app");
