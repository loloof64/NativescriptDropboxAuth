import Vue from "nativescript-vue";
import App from "./components/App.vue";
import VueDevtools from "nativescript-vue-devtools";
import VueCompositionAPI from "@vue/composition-api";

if (TNS_ENV !== "production") {
  Vue.use(VueDevtools);
}
import store from "./store";

Vue.use(VueCompositionAPI);
Vue.registerElement(
  "SVGImage",
  () => require("@sergeymell/nativescript-svg").SVGImage
);

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = TNS_ENV === "production";

new Vue({
  store,
  render: (h) => h("frame", [h(App)]),
}).$start();
