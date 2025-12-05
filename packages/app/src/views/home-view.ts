import { define, View, Observer, Auth } from "@calpoly/mustang";
import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";

export class HomeViewElement extends View<Model, Msg> {
  _authObserver = new Observer<Auth.Model>(this, "thegarden:auth");
  
  @state()
  userid?: string;

  @state()
  get profile() {
    return this.model.profile;
  }

  constructor() {
    super("thegarden:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: any) => {
      const { user } = auth || {};
      if (user && user.authenticated && user.username && !this.userid) {
        // User just logged in, request their profile
        this.userid = user.username;
        this.dispatchMessage(["profile/request", { userid: user.username }]);
      } else if (!user || !user.authenticated) {
        this.userid = undefined;
      }
    });
  }

  override render() {
    if (this.profile && this.profile.userid) {
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
        <p>
          <a href="/login.html" @click=${this.handleLogin}>Sign in</a> to see your memories.
        </p>
      </section>
    `;
  }

  private handleLogin() {
    const t = (window.top ?? window) as Window;
    t.location.href = "/login.html";
  }

  static styles = css`
    .home {
      padding: 2rem;
    }
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

define({ "home-view": HomeViewElement });