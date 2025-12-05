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
          <h2>Garden</h2>
          <section class="Garden">
            <ul>
              <li>
                <a href="/app/memories">Flowers</a>
              </li>
            </ul>
          </section>
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
    .Garden {
      display: grid;
      grid-template-rows: [start] 1fr 1fr 1fr 1fr 1fr 1fr [end];
      gap: var(--size-spacing-small);
    }
    ul {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--size-spacing-medium);
      list-style-type: none;
      padding: 0;
    }
    li {
      margin: 10px 0;
      text-align: center;
    }
    a {
      font-family: var(--font-primary-body);
      font-weight: var(--font-primary-body-weight);
      text-decoration: none;
      color: var(--color-text-secondary);
      font-size: 30px;
    }
    h2 {
      font-family: var(--font-primary-heading);
      text-align: center;
      font-weight: var(--font-primary-heading-weight);
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
  `;
}

export default HomeView;