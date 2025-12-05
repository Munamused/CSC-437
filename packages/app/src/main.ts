import { Auth, History, Switch, Store, define } from "@calpoly/mustang";
import { html } from "lit";
import { Msg } from "./messages";
import { Model, init } from "./model";
import update from "./update";
import TheGardenHeader from "./components/thegarden-header";
import { HomeViewElement } from "./views/home-view";

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
        <iframe src="/memories.html?embed=1" style="width:100%;height:80vh;border:0"></iframe>
      </section>
    `
  },
  {
    path: "/app/partner1",
    view: () => html`
      <section class="partner">
        <iframe src="/partner1.html?embed=1" style="width:100%;height:80vh;border:0"></iframe>
      </section>
    `
  },
  {
    path: "/app/partner2",
    view: () => html`
      <section class="partner">
        <iframe src="/partner2.html?embed=1" style="width:100%;height:80vh;border:0"></iframe>
      </section>
    `
  },
  {
    path: "/app",
    view: () => html`
        <home-view></home-view>
    `
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
  "mu-store": class AppStore
    extends Store.Provider<Model, Msg>
  {
    constructor() {
      super(update, init, "thegarden:auth");
    }
  },
  "thegarden-header": TheGardenHeader,
  "home-view": HomeViewElement
});
