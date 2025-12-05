import { LitElement } from "lit";
import { Observer, Auth } from "@calpoly/mustang";

export class AuthConsumer extends LitElement {
  _authObserver = new Observer<Auth.Model>(this, "thegarden:auth");
  _user?: Auth.User;

  connectedCallback() {
    super.connectedCallback();
    this._authObserver.observe((auth: Auth.Model) => {
      this._user = auth?.user;
    });
  }

  get authorization() {
    return (
      this._user?.authenticated && {
        Authorization: `Bearer ${(this._user as Auth.AuthenticatedUser).token}`
      }
    );
  }
}

export default AuthConsumer;
