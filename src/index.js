import Vue from "nativescript-vue";
import App from "./components/App.vue";
import VueCompositionAPI from "@vue/composition-api";

import store from "./store";

Vue.use(VueCompositionAPI);
Vue.registerElement(
  "SVGImage",
  () => require("@sergeymell/nativescript-svg").SVGImage
);

new Vue({
  store,
  render: (h) => h("frame", [h(App)]),
}).$start();
