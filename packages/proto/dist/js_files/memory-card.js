const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: inline-block; margin: 1rem; }
    .polaroid {
      width: 220px;
      background: #fff;
      border-radius: 6px;
      transform-origin: center;
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
  :host .polaroid { transform: none; }
    @media (max-width: 560px) { .polaroid { width: 160px; } img { height: 110px; } }
  </style>

  <article class="polaroid">
    <div class="photo-wrap">
      <img part="photo" alt="memory photo" />
    </div>
    <div class="meta">
      <h3><slot name="title">Untitled memory</slot></h3>
      <time part="time"><slot name="date"></slot></time>
      <div class="location" part="location"><slot name="location"></slot></div>
      <div class="desc"><slot></slot></div>
    </div>
  </article>
`;

class MemoryCard extends HTMLElement {
  static get observedAttributes() { return ['img-src','date','location']; }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._shadow.appendChild(template.content.cloneNode(true));
    this.$img = this._shadow.querySelector('img');
    this.$time = this._shadow.querySelector('time');
    this.$location = this._shadow.querySelector('.location');
  }

  connectedCallback() {
    this._updateImage();
    this._updateDate();
    this._updateLocation();

  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === 'img-src') this._updateImage();
    if (name === 'date') this._updateDate();
    if (name === 'location') this._updateLocation();
  }

  _updateImage() {
    const src = this.getAttribute('img-src');
    if (src) {
      this.$img.src = src;
      this.$img.removeAttribute('hidden');
    } else {
      this.$img.setAttribute('hidden', '');
    }
  }

  _updateDate() {
    const date = this.getAttribute('date');
    if (date) {
      try {
        const t = new Date(date);
        if (!isNaN(t)) {
          this.$time.textContent = t.toLocaleDateString();
          this.$time.setAttribute('datetime', t.toISOString());
        } else {
          this.$time.textContent = date;
        }
      } catch (e) {
        this.$time.textContent = date;
      }
    }
  }

  _updateLocation() {
    const loc = this.getAttribute('location');
    if (loc) this.$location.textContent = loc;
  }
}

customElements.define('memory-card', MemoryCard);

export default MemoryCard;
