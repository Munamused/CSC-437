import { Auth, define, History, Switch } from "@calpoly/mustang";
import { html } from "lit";
import TheGardenHeader from "./components/thegarden-header";
import HomeView from "./views/home-view";

const routes = [
  {
    path: "/app/couple",
    view: () => html`
      <section class="couple">
        <iframe src="/couple.html?embed=1" style="width:100%;height:80vh;border:0"></iframe>
      </section>
    `
  },
  {
    path: "/app/memories",
    view: () => html`
      <section class="memories">
        <h2>Memories</h2>
        <iframe src="/memories.html?embed=1" style="width:100%;height:80vh;border:0"></iframe>
      </section>
    `
  },
  {
    path: "/app/partner1",
    view: () => html`
      <section class="partner">
        <h2>Partner 1</h2>
        <iframe src="/partner1.html?embed=1" style="width:100%;height:80vh;border:0"></iframe>
      </section>
    `
  },
  {
    path: "/app/partner2",
    view: () => html`
      <section class="partner">
        <h2>Partner 2</h2>
        <iframe src="/partner2.html?embed=1" style="width:100%;height:80vh;border:0"></iframe>
      </section>
    `
  },
  {
    path: "/app",
    view: () => html`<home-view></home-view>`
  },
  {
    path: "/",
    redirect: "/app"
  }
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "thegarden:history", "thegarden:auth");
    }
  },
  "thegarden-header": TheGardenHeader,
  "home-view": HomeView
});
