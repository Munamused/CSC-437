import { define, Form, View, Observer, Auth, History } from "@calpoly/mustang";
import { html, css } from "lit";
import { state, property } from "lit/decorators.js";
import { Msg } from "../messages";
import { Model } from "../model";
import { MemoryItem } from "../../../server/src/models/memory";

export class MemoryEditElement extends View<Model, Msg> {
  static uses = define({
    "mu-form": Form.Element
  });

  _authObserver = new Observer<Auth.Model>(this, "thegarden:auth");

  @property()
  memoryid?: string;

  @state()
  userid?: string;

  @state()
  get memory(): MemoryItem | undefined {
    if (!this.memoryid || this.memoryid === "new") {
      return undefined;
    }
    const memories = this.model.memories?.memories ?? [];
    return memories.find((m) => m.memoryid === this.memoryid);
  }

  constructor() {
    super("thegarden:model");
  }

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: any) => {
      const { user } = auth || {};
      if (user && user.authenticated && user.username) {
        this.userid = user.username;
      } else {
        this.userid = undefined;
      }
    });
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);
    if (
      name === "memory-id" &&
      oldValue !== newValue &&
      newValue &&
      newValue !== "new"
    ) {
      this.dispatchMessage([
        "memories/request",
        { userid: this.userid || "" }
      ]);
    }
  }

  handleSubmit(event: Form.SubmitEvent<MemoryItem>) {
    this.dispatchMessage([
      "memory/save",
      {
        memoryid: this.memoryid || "new",
        memory: event.detail
      },
      {
        onSuccess: () =>
          History.dispatch(this, "history/navigate", {
            href: `/app/memories`
          }),
        onFailure: (error: Error) =>
          console.log("ERROR:", error)
      }
    ]);
  }

  handleCancel() {
    History.dispatch(this, "history/navigate", {
      href: `/app/memories`
    });
  }

  override render() {
    if (!this.userid) {
      return html`
        <section class="memory-edit">
          <h2>Edit Memory</h2>
          <p>Please <a href="/login.html">sign in</a> to edit memories.</p>
        </section>
      `;
    }

    const init = this.memory || {
      name: "",
      location: "",
      date: new Date().toISOString().split("T")[0],
      description: ""
    };

    return html`
      <section class="memory-edit">
        <h2>${this.memoryid === "new" ? "Add New Memory" : "Edit Memory"}</h2>
        <mu-form .init=${init} @mu-form:submit=${this.handleSubmit}>
          <label>
            <span>Memory Name</span>
            <input name="name" required />
          </label>
          <label>
            <span>Date</span>
            <input name="date" type="date" required />
          </label>
          <label>
            <span>Location</span>
            <input name="location" required />
          </label>
          <label>
            <span>Description</span>
            <textarea name="description" rows="4"></textarea>
          </label>
          <div class="button-group">
            <button type="submit">Save Memory</button>
            <button type="button" @click=${this.handleCancel}>Cancel</button>
          </div>
        </mu-form>
      </section>
    `;
  }

  static styles = css`
    .memory-edit {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    h2 {
      font-family: var(--font-primary-heading);
      font-size: 2.5rem;
      margin-bottom: 2rem;
      text-align: center;
      font-weight: var(--font-primary-heading-weight);
    }
    p {
      text-align: center;
      font-size: 1.1rem;
    }
    a {
      color: var(--color-text-secondary);
      text-decoration: none;
      font-weight: 500;
    }
    mu-form {
      display: block;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    label span {
      display: block;
      font-weight: 500;
      font-family: var(--font-primary-body);
    }
    input,
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--color-border-primary);
      border-radius: var(--size-border-radius-medium);
      font-family: var(--font-primary-body);
      font-size: 1rem;
      box-sizing: border-box;
    }
    textarea {
      resize: vertical;
      min-height: 100px;
    }
    .button-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 2rem;
    }
    button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      border: 2px solid var(--color-border-primary);
      border-radius: var(--size-border-radius-medium);
      font-family: var(--font-primary-body);
      font-weight: var(--font-primary-body-weight);
    }
    button[type="submit"] {
      background-color: var(--color-accent-primary);
      color: var(--color-text-on-accent);
    }
    button[type="button"] {
      background-color: var(--color-secondary-background);
      color: var(--color-text-primary);
    }
    button:hover {
      opacity: 0.9;
    }
  `;
}

define({ "memory-edit": MemoryEditElement });

export default MemoryEditElement;