import { html, css, LitElement } from "lit";
import { state } from "lit/decorators.js";
import { Observer, Auth, Events } from "@calpoly/mustang";

export class TheGardenHeader extends LitElement {

  _authObserver = new Observer<Auth.Model>(this, "thegarden:auth");
  _authModel?: Auth.Model;

  @state()
  loggedIn = false;

  @state()
  userid?: string;

  connectedCallback() {
    super.connectedCallback();

    this._authObserver.observe((auth: any) => {
      // Store reference to the model so we can update it later
      this._authModel = auth;
      
      const { user } = auth || {};

        console.log("user:", user);
        console.log("user.authenticated:", user?.authenticated);

      if (user && user.authenticated) {
        this.loggedIn = true;
        this.userid = user.username;
      } else {
        this.loggedIn = false;
        this.userid = undefined;
      }
      // Trigger re-render when auth state changes
      this.requestUpdate();
    });

    // Listen for auth update events from the window
    window.addEventListener('auth:updated', () => {
      console.log('Auth updated event received, requesting update');
      this.requestUpdate();
    });
  }

  // Public method to update auth state that can be called from outside
  updateAuthState(authenticated: boolean, username?: string, token?: string) {
    if (this._authModel) {
      console.log('Updating auth state in header:', { authenticated, username });
      this._authModel.user = {
        authenticated,
        username: username || 'anonymous',
        token
      };
      this.loggedIn = authenticated;
      this.userid = username;
      this.requestUpdate();
    }
  }

  renderSignOutButton() {
    return html`
      <button
        @click=${(e: UIEvent) => {
          try {
            localStorage.clear();
          } catch (err) {}
          Events.relay(e, "auth:message", ["auth/signout"]);
        }}
      >
        Sign Out
      </button>
    `;
  }

  renderSignInButton() {
    return html`
      <a href="/login.html" @click=${() => { const t = (window.top ?? window) as Window; t.location.href = '/login.html'; }}>Sign in</a>
    `;
  }

  override render() {
    console.log("render - loggedIn:", this.loggedIn, "userid:", this.userid);
    return html`
      <header>
        <div class="brand">
          <a href="/app"><h1>The Garden</h1></a>
        </div>
        <div class="right">
          <div class="content">
            <nav class="Couple"><a href="/app/couple"><h2>Couple</h2></a></nav>
          </div>
          <div class="meta">
          <span class="userid">Hello, ${this.userid || 'guest'}</span>
            ${this.loggedIn 
              ? this.renderSignOutButton() 
              : this.renderSignInButton()
            }
          </div>
        </div>
      </header>
    `;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1.25rem;
      width: 100%;
      box-sizing: border-box;
      background: var(--color-secondary-background);
    }
    .brand {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 1.5rem;
      flex: 0 0 auto;
    }
    .content {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex: auto 1 1;
    }
    .right {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .meta {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .userid {
      font-weight: 600;
      margin-left: 0.25rem;
    }
    a {
      text-decoration: none;
      color: inherit;
    }
    button {
      cursor: pointer;
      padding: 0.4rem 0.6rem;
    }
  `;
}

export default TheGardenHeader;
