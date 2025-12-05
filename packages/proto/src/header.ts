import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Observer, Auth, Events } from "@calpoly/mustang";

export class HeaderElement extends LitElement {
  _authObserver = new Observer<Auth.Model>(this, "thegarden:auth");

  @state()
  loggedIn = false;

  @state()
  userid?: string;

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe((auth: any) => {
      const { user } = auth || {};

      if (user && user.authenticated) {
        this.loggedIn = true;
        // prefer username, fall back to userid or name
        this.userid = user.username || user.userid || user.name;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
    });
  }

  renderSignOutButton() {
    return html`
      <button
        @click=${(e: UIEvent) => {
          Events.relay(e, "auth:message", ["auth/signout"]);
        }}
      >
        Sign Out
      </button>
    `;
  }

  renderSignInButton() {
    return html`
      <a href="/login.html" @click=${() => { const t = (window.top ?? window) as Window; t.location.href = '/login.html'; }} rel="noopener">Sign In…</a>
    `;
  }

  override render() {
    return html`
      <header>
        <div class="brand">
          <slot name="brand">
            <a href="/index.html"><h1>The Garden</h1></a>
          </slot>
        </div>
        <div class="content">
          <slot name="content">
            <a href="couple.html"><h2>Couple</h2></a>
          </slot>
        </div>
        <div class="meta">
          ${this.loggedIn ? html`${this.renderSignOutButton()}<span class="userid">Hello, ${this.userid}</span>` : this.renderSignInButton()}
        </div>
      </header>
    `;
  }

  static styles = css`
    :host { display: block; }
        :host { display: block; width: 100%; }
        :host { display: block; width: 100%; position: sticky; top: 0; left: 0; right: 0; z-index: 1000; }
        header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          background: var(--color-secondary-background, #f6f6f6);
          width: 100%;
          box-sizing: border-box;
        }
        .brand { display: flex; align-items: center; justify-content: flex-start; flex: 0 0 auto; }
        .content { display: flex; align-items: center; justify-content: flex-end; flex: auto 1 1;}
        .meta { display: flex; align-items: center; gap: 1.25rem; margin-left: auto; }
        .userid { font-weight: 600; margin-left: 0.25rem; }
        button { cursor: pointer; padding: 0.4rem 0.6rem; }
  `;

  static initializeOnce() {
    // placeholder for any one-time initialization
  }
}

export default HeaderElement;
