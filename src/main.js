import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router";
import store from "./store/store";
import { auth } from "./includes/firebase";
import Icon from "./directives/icon";
import "./assets/tailwind.css";
import "./assets/main.css";
import VeeValidationPlugin from "./includes/validation";

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    // Plugins must be used before mounting the app
    app.use(store);
    app.use(router);
    app.use(VeeValidationPlugin);
    app.directive("icon", Icon);

    app.mount("#app");
  }
});
