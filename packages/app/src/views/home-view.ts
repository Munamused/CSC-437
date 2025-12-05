import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Observer, Auth } from "@calpoly/mustang";

export class HomeView extends LitElement {
  _authObserver = new Observer<Auth.Model>(this, "thegarden:auth");

  @state()
  loggedIn = false;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: any) => {
      const { user } = auth || {};
      this.loggedIn = Boolean(user && user.authenticated);
    });
  }

  override render() {
    if (this.loggedIn) {
      return html`
        <section class="home">
          <h2>Welcome back</h2>
          <p>Access your memories and content below.</p>
          <iframe src="/index.html?embed=1" style="width:100%;height:70vh;border:0"></iframe>
        </section>
      `;
    }

    return html`
      <section class="home">
        <h2>Welcome to The Garden</h2>
        <p>This site helps you save and browse shared memories.</p>
        <p><a href="/login.html" @click=${() => { const t = (window.top ?? window) as Window; t.location.href = '/login.html'; }}>Sign in</a> to see your memories.</p>
      </section>
    `;
  }

  static styles = css`
    .home { padding: 2rem; }
  `;
}

export default HomeView;
