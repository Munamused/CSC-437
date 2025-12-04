import { css } from "lit";

const styles = css`
    .login-out {
        padding: 10px 20px;
        background-color: var(--color-sub-background);
        color: var(--color-button-text);
        text-align: center;
        text-decoration: none;
        width: auto;
        height: 100%;
        font-size: var(--p-font-size);
        font-family: var(--main-font-family);
        font-weight: var(--main-font-weight);
        font-style: var(--main-font-type);
        border: 1px solid var(--color-sub-support);
        border-radius: var(--border-sub-radius-content);
        cursor: pointer;
      }

      .login-out:hover {
        background-color: var(--color-button-text);
        color: var(--color-sub-background);
      }

      #intro {
        padding: 0 16px;
        color: var(--color-main-support);
        text-align: center;
        text-decoration: none;
        font-size: var(--p-font-size);
        height: 100%;
        font-family: var(--main-font-family);
        font-weight: var(--main-font-weight);
        font-style: var(--main-font-type);
      }
`;

export default { styles };