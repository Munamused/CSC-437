import { define, View, Observer, Auth, History } from "@calpoly/mustang";
import { html, css } from "lit";
import { state } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { MemoryItem } from "../../../server/src/models/memory";

export class MemoriesViewElement extends View<Model, Msg> {
  _authObserver = new Observer<Auth.Model>(this, "thegarden:auth");

  @state()
  userid?: string;

  @state()
  requested = false;

  constructor() {
    super("thegarden:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: any) => {
      const { user } = auth || {};
      if (user && user.authenticated && user.username) {
        const nextUser = user.username;
        const changedUser = this.userid && this.userid !== nextUser;
        this.userid = nextUser;
        if (!this.requested || changedUser) {
          this.requested = true;
          this.dispatchMessage(["memories/request", { userid: nextUser }]);
        }
      } else {
        this.userid = undefined;
        this.requested = false;
      }
    });
  }

  get memories(): MemoryItem[] {
    return this.model.memories?.memories ?? [];
  }

  override render() {
    if (!this.userid) {
      return html`
        <section class="memories">
          <h2>Memories</h2>
          <p>Please <a href="/login.html" @click=${this.handleLogin}>sign in</a> to view memories.</p>
        </section>
      `;
    }

    const list = this.memories;
    return html`
      <section class="memories">
        <header class="memories-header">
          <h2>Memories</h2>
          <button class="add-btn" @click=${this.handleAddMemory}>
            + Add Memory
          </button>
        </header>
        ${list.length === 0
          ? html`<p>No memories yet. Click "Add Memory" to create your first one!</p>`
          : html`
              <div class="memories-grid">
                ${list.map((m) => this.renderCard(m))}
              </div>
            `}
      </section>
    `;
  }

  renderCard(m: MemoryItem) {
    const dateStr = m.date ? (m.date as any).toLocaleDateString?.() || new Date(m.date as any).toLocaleDateString() : "";
    return html`
      <article class="memory-card" @click=${() => this.handleEditMemory(m.memoryid)}>
        <header>
          <h3>${m.name}</h3>
          <span class="date">${dateStr}</span>
        </header>
        <div class="location">📍 ${m.location}</div>
        ${m.description ? html`<p>${m.description}</p>` : null}
      </article>
    `;
  }

  private handleLogin() {
    const t = (window.top ?? window) as Window;
    t.location.href = "/login.html";
  }

  private handleAddMemory() {
    History.dispatch(this, "history/navigate", {
      href: "/app/memories/new"
    });
  }

  private handleEditMemory(memoryid: string) {
    History.dispatch(this, "history/navigate", {
      href: `/app/memories/${memoryid}/edit`
    });
  }

  static styles = css`
    .memories {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .memories-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    h2 {
      font-family: var(--font-primary-heading);
      font-size: 2.5rem;
      margin: 0;
      font-weight: var(--font-primary-heading-weight);
    }
    .add-btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      background-color: var(--color-accent-primary);
      color: var(--color-text-on-accent);
      border: 2px solid var(--color-border-primary);
      border-radius: var(--size-border-radius-medium);
      font-family: var(--font-primary-body);
      font-weight: var(--font-primary-body-weight);
    }
    .add-btn:hover {
      opacity: 0.9;
    }
    p {
      text-align: center;
      font-size: 1.1rem;
      color: var(--color-text-secondary);
    }
    a {
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 600;
    }
    .memories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--size-spacing-medium);
    }
    .memory-card {
      border: 2px solid var(--color-border-primary);
      border-radius: var(--size-border-radius-medium);
      padding: 1.25rem;
      background: var(--color-secondary-background);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .memory-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .memory-card header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.5rem;
    }
    .memory-card h3 {
      margin: 0;
      font-size: 1.4rem;
      font-family: var(--font-primary-heading);
    }
    .date {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
    }
    .location {
      font-weight: 600;
      font-size: 1rem;
    }
    .memory-card p {
      margin: 0;
      text-align: left;
      color: var(--color-text-secondary);
      line-height: 1.5;
    }
  `;
}

define({ "memories-view": MemoriesViewElement });

export default MemoriesViewElement;
