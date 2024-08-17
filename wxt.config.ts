import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-vue"],
  imports: {
    presets: ["vue"],
  },
  manifest: {
    name: "HdM Notenrechner",
    description:
      "Berechnet den Notendurchschnitt und andere Statistiken im Notenportal der HdM Stuttgart",
    author: "Tobias Messner",
    short_name: "HdM Noten",
  },
});
