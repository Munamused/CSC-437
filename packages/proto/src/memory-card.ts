// src/memory-card.ts
import { html, css, LitElement } from "lit";
import { property } from "lit/decorators.js";

export class MemoryCardElement extends LitElement {
  // Attributes mapped to properties
  @property({ attribute: 'img-src' }) imgSrc = '';
  @property() date = '';
  @property() location = '';

  static styles = css`
    :host { display: inline-block; margin: 1rem; }
    .polaroid {
      width: var(--memory-card-width, 220px);
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      color: #222;
      user-select: none;
    }
    .photo-wrap {
      background: linear-gradient(180deg,#e9e9e9,#f4f4f4);
      display: block;
      padding: 0.5rem 0.5rem 0 0.5rem;
    }
    img {
      display: block;
      width: 100%;
      height: 140px;
      object-fit: cover;
      border-radius: 4px;
      background: #ddd;
    }
    .meta { padding: 0.6rem 0.8rem 1rem 0.8rem; }
    h3 { margin: 0 0 0.25rem 0; font-size: 1rem; font-weight: 700; }
    time { display: block; font-size: 0.8rem; color: #666; margin-bottom: 0.25rem; }
    .location { font-size: 0.85rem; color: #444; margin-bottom: 0.5rem; }
    .desc { font-size: 0.9rem; color: #333; }
    @media (max-width: 560px) { .polaroid { width: 160px; } img { height: 110px; } }
  `;

  private formatDate(dateStr: string) {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d.toLocaleDateString();
    } catch (e) {}
    return dateStr;
  }

  override render() {
    return html`
      <article class="polaroid">
        <div class="photo-wrap">
          <img src=${this.imgSrc || ''} alt="memory photo" ?hidden=${!this.imgSrc} />
        </div>
        <div class="meta">
          <h3><slot name="title">Untitled memory</slot></h3>
          <time part="time">${this.date ? this.formatDate(this.date) : html`<slot name="date"></slot>`}</time>
          <div class="location" part="location">${this.location ? this.location : html`<slot name="location"></slot>`}</div>
          <div class="desc"><slot></slot></div>
        </div>
      </article>
    `;
  }
}

export default MemoryCardElement;