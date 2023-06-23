import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";

import "@/css/bs5-custom.css";
import "bootstrap";
import "@/css/app.css";

const app = createApp(App);
app.use(store);
window.vm = app.mount("#app");
