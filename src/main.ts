import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import ToastService from "primevue/toastservice";
import Tooltip from "primevue/tooltip";
import NProgress from "nprogress";

import "primeicons/primeicons.css";
import "nprogress/nprogress.css";
import "./assets/main.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

NProgress.configure({ showSpinner: false, easing: "ease" });

const app = createApp(App);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: "p",
      darkModeSelector: "system",
      cssLayer: true,
    },
  },
});
app.use(ToastService);
app.use(router);

app.directive("tooltip", Tooltip);

app.mount("#app");
