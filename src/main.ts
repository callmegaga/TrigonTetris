import "./assets/style/main.css";
import { createApp } from "vue";
import { inject as injectAnalytics } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import App from "./App.vue";

injectAnalytics();
injectSpeedInsights();
createApp(App).mount("#app");
