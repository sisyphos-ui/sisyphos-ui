import { createApp, defineComponent, h } from "vue";
import "@sisyphos-ui/vue/styles.css";
import { DEMOS } from "./demos/registry";

const params = new URLSearchParams(window.location.search);
const slug = params.get("demo") ?? "";
const Demo = DEMOS[slug] ?? null;

const App = defineComponent({
  name: "PreviewRoot",
  setup() {
    return () =>
      Demo
        ? h(Demo)
        : h(
            "div",
            { class: "empty-demo" },
            slug
              ? `Vue preview for "${slug}" is coming soon.`
              : "Pass a ?demo=<slug> query parameter to render a Vue demo."
          );
  },
});

createApp(App).mount("#app");
