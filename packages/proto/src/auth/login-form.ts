import { html, css } from "lit";
import AuthConsumer from "./auth-consumer";
import { property, state } from "lit/decorators.js";
import reset from "../styles/reset.css.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends AuthConsumer {
  @state()
  formData: LoginFormData = {};

  @property()
  api?: string;

  @property()
  redirect: string = "/";

  @state()
  error?: string;

  get canSubmit(): boolean {
    return Boolean(
      this.api && this.formData.username && this.formData.password,
    );
  }

  override render() {
    return html`
      <form
        @input=${(e: InputEvent) => this.handleChange(e)}
        @submit=${(e: SubmitEvent) => this.handleSubmit(e)}
      >
        <slot></slot>
        <slot name="button">
          <button class="login-button" ?disabled=${!this.canSubmit} type="submit">Login</button>
        </slot>
        <p class="error">${this.error}</p>
      </form>
    `;
  }

  static styles = [
    reset.styles,

    css`
      .error:not(:empty) {
        color: var(--color-error);
        border: 1px solid var(--color-error);
        padding: var(--size-spacing-medium);
      }

      .login-button {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 0.5rem;
        background-color: var(--color-sub-background);
        color: var(--color-button-text);
        text-align: center;
        text-decoration: none;
        width: 100%;
        max-width: 300px;
        height: 30px;
        font-family: var(--main-font-family);
        font-weight: var(--main-font-weight);
        font-style: var(--main-font-type);
        font-size: var(--p-font-size);
        border: var(--border-thickness-content) solid var(--color-sub-background);
        border-radius: var(--border-sub-radius-content);
        cursor: pointer;
        transition: transform 0.3s ease;
      }

    .login-button:hover {
      background-color: var(--color-button-text);
      color: var(--color-sub-background);
      transform: scale(1.03);
    }

    .login-button:active {
      transform: scale(1.03);
    }
    `,
  ];

  handleChange(event: InputEvent) {
    const target = event.target as HTMLInputElement;
    const name = target?.name;
    const value = target?.value;
    const prevData = this.formData;

    switch (name) {
      case "username":
        this.formData = { ...prevData, username: value };
        break;
      case "password":
        this.formData = { ...prevData, password: value };
        break;
    }
  }

  handleSubmit(submitEvent: SubmitEvent) {
    submitEvent.preventDefault();

    if (this.canSubmit) {
      fetch(
        this?.api || "",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.formData)
        }
      )
      .then((res) => {
        if (res.status !== 200)
          throw "Login failed";
        else return res.json();
      })
      .then((json: object) => {
          const { token } = json as { token: string };
          // persist token to localStorage so other windows/providers can pick it up
          try { localStorage.setItem('thegarden:token', token); } catch (e) {}
          const customEvent = new CustomEvent(
          'auth:message', {
          bubbles: true,
          composed: true,
          detail: [
              'auth/signin',
              { token, redirect: this.redirect }
          ]
          });
          console.log("dispatching message", customEvent);
          this.dispatchEvent(customEvent);
          // also try to inform the top-level window in case the component is inside an iframe
          try { if (window.top && window.top !== window) window.top.dispatchEvent(customEvent); } catch (e) {}
      })
      .catch((error: Error) => {
          console.log(error);
          this.error = error.toString();
      });
    }
  }
}
