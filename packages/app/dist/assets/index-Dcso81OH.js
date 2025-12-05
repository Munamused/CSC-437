(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(r){if(r.ep)return;r.ep=!0;const o=e(r);fetch(r.href,o)}})();var B,Pe;class ht extends Error{}ht.prototype.name="InvalidTokenError";function Zs(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Qs(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Zs(t)}catch{return atob(t)}}function rs(i,t){if(typeof i!="string")throw new ht("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new ht(`Invalid token specified: missing part #${e+1}`);let r;try{r=Qs(s)}catch(o){throw new ht(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(r)}catch(o){throw new ht(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const Xs="mu:context",te=`${Xs}:change`;class tr{constructor(t,e){this._proxy=er(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class oe extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new tr(t,this),this.style.display="contents"}attach(t){return this.addEventListener(te,t),t}detach(t){this.removeEventListener(te,t)}}function er(i,t){return new Proxy(i,{get:(s,r,o)=>r==="then"?void 0:Reflect.get(s,r,o),set:(s,r,o,n)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,o);const a=Reflect.set(s,r,o,n);if(a){let h=new CustomEvent(te,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(h,{property:r,oldValue:l,value:o}),t.dispatchEvent(h)}else console.log(`Context['${r}] was not set to ${o}`);return a}})}function sr(i,t){const e=is(t,i);return new Promise((s,r)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function is(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return is(i,r.host)}class rr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ns(i="mu:message"){return(t,...e)=>t.dispatchEvent(new rr(e,i))}class ae{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${t[0]} message`,t);const e=this._update(t,this._context.value);if(console.log(`Next[${t[0]}] => `,e),!Array.isArray(e))this._context.value=e;else{const[s,...r]=e;this._context.value=s,r.forEach(o=>o.then(n=>{n.length&&this.consume(n)}))}}}const ee="mu:auth:jwt",os=class as extends ae{constructor(t,e){super((s,r)=>this.update(s,r),t,as.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":{const{token:r,redirect:o}=t[1];return[nr(r),Jt(o)]}case"auth/signout":return[or(e.user),Jt(this._redirectForLogin)];case"auth/redirect":return[e,Jt(this._redirectForLogin,{next:window.location.href})];default:const s=t[0];throw new Error(`Unhandled Auth message "${s}"`)}}};os.EVENT_TYPE="auth:message";let ls=os;const cs=ns(ls.EVENT_TYPE);function Jt(i,t){return new Promise((e,s)=>{if(i){const r=window.location.href,o=new URL(i,r);t&&Object.entries(t).forEach(([n,l])=>o.searchParams.set(n,l)),console.log("Redirecting to ",i),window.location.assign(o)}e([])})}class ir extends oe{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=Z.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ls(this.context,this.redirect).attach(this)}}class K{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ee),t}}class Z extends K{constructor(t){super();const e=rs(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Z(t);return localStorage.setItem(ee,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ee);return t?Z.authenticate(t):new K}}function nr(i){return{user:Z.authenticate(i),token:i}}function or(i){return{user:i&&i.authenticated?K.deauthenticate(i):i,token:""}}function ar(i){return i&&i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function lr(i){return i.authenticated?rs(i.token||""):{}}const Q=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Z,Provider:ir,User:K,dispatch:cs,headers:ar,payload:lr},Symbol.toStringTag,{value:"Module"}));function hs(i,t,e){const s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});i.dispatchEvent(s)}function Ot(i,t,e){const s=i.target;hs(s,t,e)}function se(i,t="*"){return i.composedPath().find(r=>{const o=r;return o.tagName&&o.matches(t)})||void 0}const cr=Object.freeze(Object.defineProperty({__proto__:null,dispatchCustom:hs,originalTarget:se,relay:Ot},Symbol.toStringTag,{value:"Module"}));function le(i,...t){const e=i.map((r,o)=>o?[t[o-1],r]:[r]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const hr=new DOMParser;function j(i,...t){const e=t.map(l),s=i.map((a,h)=>{if(h===0)return[a];const p=e[h-1];return p instanceof Node?[`<ins id="mu-html-${h-1}"></ins>`,a]:[p,a]}).flat().join(""),r=hr.parseFromString(s,"text/html"),o=r.head.childElementCount?r.head.children:r.body.children,n=new DocumentFragment;return n.replaceChildren(...o),e.forEach((a,h)=>{if(a instanceof Node){const p=n.querySelector(`ins#mu-html-${h}`);if(p){const u=p.parentNode;u==null||u.replaceChild(a,p)}else console.log("Missing insertion point:",`ins#mu-html-${h}`)}}),n;function l(a,h){if(a===null)return"";switch(typeof a){case"string":return Ce(a);case"bigint":case"boolean":case"number":case"symbol":return Ce(a.toString());case"object":if(Array.isArray(a)){const p=new DocumentFragment,u=a.map(l);return p.replaceChildren(...u),p}return a instanceof Node?a:new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ce(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function jt(i,t={mode:"open"}){const e=i.attachShadow(t),s={template:r,styles:o};return s;function r(n){const l=n.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function o(...n){e.adoptedStyleSheets=n}}let ur=(B=class extends HTMLElement{constructor(){super(),this._state={},jt(this).template(B.template).styles(B.styles),this.addEventListener("change",i=>{const t=i.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",i=>{i.preventDefault(),Ot(i,"mu-form:submit",this._state)}),this.submitSlot&&this.submitSlot.addEventListener("slotchange",()=>{var i,t;for(const e of((i=this.submitSlot)==null?void 0:i.assignedNodes())||[])(t=this.form)==null||t.insertBefore(e,this.submitSlot)})}set init(i){this._state=i||{},dr(this._state,this)}get form(){var i;return(i=this.shadowRoot)==null?void 0:i.querySelector("form")}get submitSlot(){var i;const t=(i=this.shadowRoot)==null?void 0:i.querySelector('slot[name="submit"]');return t||null}},B.template=j`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,B.styles=le`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,B);function dr(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;case"date":r instanceof Date?n.value=r.toISOString().substr(0,10):n.value=r;break;default:n.value=r;break}}}return i}const pr=Object.freeze(Object.defineProperty({__proto__:null,Element:ur},Symbol.toStringTag,{value:"Module"})),us=class ds extends ae{constructor(t){super((e,s)=>this.update(e,s),t,ds.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];return mr(s,r)}case"history/redirect":{const{href:s,state:r}=t[1];return yr(s,r)}}}};us.EVENT_TYPE="history:message";let ce=us;class Oe extends oe{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=fr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(!this._root||s.pathname.startsWith(this._root))&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),he(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ce(this.context).attach(this),this._root=this.getAttribute("root")||void 0}}function fr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function mr(i,t={}){return history.pushState(t,"",i),{location:document.location,state:history.state}}function yr(i,t={}){return history.replaceState(t,"",i),{location:document.location,state:history.state}}const he=ns(ce.EVENT_TYPE),mt=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Oe,Provider:Oe,Service:ce,dispatch:he},Symbol.toStringTag,{value:"Module"}));class x{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new ke(this._provider,t);this._effects.push(r),e(r)}else sr(this._target,this._contextLabel).then(r=>{const o=new ke(r,t);this._provider=r,this._effects.push(o),r.attach(n=>this._handleChange(n)),e(o)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class ke{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ps=class fs extends HTMLElement{constructor(){super(),this._state={},this._user=new K,this._authObserver=new x(this,"blazing:auth"),jt(this).template(fs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;gr(r,this._state,e,this.authorization).then(o=>ot(o,this)).then(o=>{const n=`mu-rest-form:${s}`,l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:o,url:r}});this.dispatchEvent(l)}).catch(o=>{const n="mu-rest-form:error",l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:r,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},ot(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Te(this.src,this.authorization).then(e=>{this._state=e,ot(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Te(this.src,this.authorization).then(r=>{this._state=r,ot(r,this)});break;case"new":s&&(this._state={},ot({},this));break}}};ps.observedAttributes=["src","new","action"];ps.template=j`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Te(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function ot(i,t){const e=Object.entries(i);for(const[s,r]of e){const o=t.querySelector(`[name="${s}"]`);if(o){const n=o;switch(n.type){case"checkbox":const l=n;l.checked=!!r;break;default:n.value=r;break}}}return i}function gr(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()})}const ms=class ys extends ae{constructor(t,e){super(e,t,ys.EVENT_TYPE,!1)}};ms.EVENT_TYPE="mu:message";let gs=ms;class vr extends oe{constructor(t,e,s){super(e),this._user=new K,this._updateFn=t,this._authObserver=new x(this,s)}connectedCallback(){const t=new gs(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const _r=Object.freeze(Object.defineProperty({__proto__:null,Provider:vr,Service:gs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,ue=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),Re=new WeakMap;let vs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ue&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Re.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Re.set(e,t))}return t}toString(){return this.cssText}};const $r=i=>new vs(typeof i=="string"?i:i+"",void 0,de),br=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1],i[0]);return new vs(e,i,de)},wr=(i,t)=>{if(ue)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=Pt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ne=ue?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return $r(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ar,defineProperty:Er,getOwnPropertyDescriptor:Sr,getOwnPropertyNames:xr,getOwnPropertySymbols:Pr,getPrototypeOf:Cr}=Object,X=globalThis,Me=X.trustedTypes,Or=Me?Me.emptyScript:"",Ue=X.reactiveElementPolyfillSupport,ut=(i,t)=>i,kt={toAttribute(i,t){switch(t){case Boolean:i=i?Or:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},pe=(i,t)=>!Ar(i,t),Le={attribute:!0,type:String,converter:kt,reflect:!1,useDefault:!1,hasChanged:pe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),X.litPropertyMetadata??(X.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Le){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Er(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=Sr(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const l=r==null?void 0:r.call(this);o==null||o.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Le}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Cr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...xr(e),...Pr(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ne(r))}else t!==void 0&&e.push(Ne(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return wr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var s;const r=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,r);if(o!==void 0&&r.reflect===!0){const n=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:kt).toAttribute(e,r.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var s,r;const o=this.constructor,n=o._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const l=o.getPropertyOptions(n),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((s=l.converter)==null?void 0:s.fromAttribute)!==void 0?l.converter:kt;this._$Em=n,this[n]=a.fromAttribute(e,l.type)??((r=this._$Ej)==null?void 0:r.get(n))??null,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const o=this.constructor,n=this[t];if(s??(s=o.getPropertyOptions(t)),!((s.hasChanged??pe)(n,e)||s.useDefault&&s.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r){const{wrapped:l}=n,a=this[o];l!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)}),this.update(s)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[ut("elementProperties")]=new Map,W[ut("finalized")]=new Map,Ue==null||Ue({ReactiveElement:W}),(X.reactiveElementVersions??(X.reactiveElementVersions=[])).push("2.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Rt=Tt.trustedTypes,je=Rt?Rt.createPolicy("lit-html",{createHTML:i=>i}):void 0,_s="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,$s="?"+P,kr=`<${$s}>`,I=document,yt=()=>I.createComment(""),gt=i=>i===null||typeof i!="object"&&typeof i!="function",fe=Array.isArray,Tr=i=>fe(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Yt=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,He=/-->/g,Ie=/>/g,N=RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ze=/'/g,De=/"/g,bs=/^(?:script|style|textarea|title)$/i,Rr=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),lt=Rr(1),tt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),qe=new WeakMap,U=I.createTreeWalker(I,129);function ws(i,t){if(!fe(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return je!==void 0?je.createHTML(t):t}const Nr=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=at;for(let l=0;l<e;l++){const a=i[l];let h,p,u=-1,c=0;for(;c<a.length&&(n.lastIndex=c,p=n.exec(a),p!==null);)c=n.lastIndex,n===at?p[1]==="!--"?n=He:p[1]!==void 0?n=Ie:p[2]!==void 0?(bs.test(p[2])&&(r=RegExp("</"+p[2],"g")),n=N):p[3]!==void 0&&(n=N):n===N?p[0]===">"?(n=r??at,u=-1):p[1]===void 0?u=-2:(u=n.lastIndex-p[2].length,h=p[1],n=p[3]===void 0?N:p[3]==='"'?De:ze):n===De||n===ze?n=N:n===He||n===Ie?n=at:(n=N,r=void 0);const d=n===N&&i[l+1].startsWith("/>")?" ":"";o+=n===at?a+kr:u>=0?(s.push(h),a.slice(0,u)+_s+a.slice(u)+P+d):a+P+(u===-2?l:d)}return[ws(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let re=class As{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[h,p]=Nr(t,e);if(this.el=As.createElement(h,s),U.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=U.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(_s)){const c=p[n++],d=r.getAttribute(u).split(P),f=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:f[2],strings:d,ctor:f[1]==="."?Ur:f[1]==="?"?Lr:f[1]==="@"?jr:Ht}),r.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:o}),r.removeAttribute(u));if(bs.test(r.tagName)){const u=r.textContent.split(P),c=u.length-1;if(c>0){r.textContent=Rt?Rt.emptyScript:"";for(let d=0;d<c;d++)r.append(u[d],yt()),U.nextNode(),a.push({type:2,index:++o});r.append(u[c],yt())}}}else if(r.nodeType===8)if(r.data===$s)a.push({type:2,index:o});else{let u=-1;for(;(u=r.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:o}),u+=P.length-1}o++}}static createElement(t,e){const s=I.createElement("template");return s.innerHTML=t,s}};function et(i,t,e=i,s){var r,o;if(t===tt)return t;let n=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=gt(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==l&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),l===void 0?n=void 0:(n=new l(i),n._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=n:e._$Cl=n),n!==void 0&&(t=et(i,n._$AS(i,t.values),n,s)),t}let Mr=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??I).importNode(e,!0);U.currentNode=r;let o=U.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new me(o,o.nextSibling,this,t):a.type===1?h=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(h=new Hr(o,this,t)),this._$AV.push(h),a=s[++l]}n!==(a==null?void 0:a.index)&&(o=U.nextNode(),n++)}return U.currentNode=I,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},me=class Es{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),gt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Tr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,o=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=re.createElement(ws(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(s);else{const n=new Mr(o,this),l=n.u(this.options);n.p(s),this.T(l),this._$AH=n}}_$AC(t){let e=qe.get(t.strings);return e===void 0&&qe.set(t.strings,e=new re(t)),e}k(t){fe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new Es(this.O(yt()),this.O(yt()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Ht=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=et(this,t,e,0),n=!gt(t)||t!==this._$AH&&t!==tt,n&&(this._$AH=t);else{const l=t;let a,h;for(t=o[0],a=0;a<o.length-1;a++)h=et(this,l[s+a],e,a),h===tt&&(h=this._$AH[a]),n||(n=!gt(h)||h!==this._$AH[a]),h===$?t=$:t!==$&&(t+=(h??"")+o[a+1]),this._$AH[a]=h}n&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ur=class extends Ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},Lr=class extends Ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},jr=class extends Ht{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??$)===tt)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Hr=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}};const Fe=Tt.litHtmlPolyfillSupport;Fe==null||Fe(re,me),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.3.0");const Ir=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new me(t.insertBefore(yt(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const vt=globalThis;let Y=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ir(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return tt}};Y._$litElement$=!0,Y.finalized=!0,(Pe=vt.litElementHydrateSupport)==null||Pe.call(vt,{LitElement:Y});const Be=vt.litElementPolyfillSupport;Be==null||Be({LitElement:Y});(vt.litElementVersions??(vt.litElementVersions=[])).push("4.2.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zr={attribute:!0,type:String,converter:kt,reflect:!1,hasChanged:pe},Dr=(i=zr,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function Ss(i){return(t,e)=>typeof e=="object"?Dr(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function xs(i){return Ss({...i,state:!0,attribute:!1})}function qr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Fr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ps={};(function(i){var t=(function(){var e=function(u,c,d,f){for(d=d||{},f=u.length;f--;d[u[f]]=c);return d},s=[1,9],r=[1,10],o=[1,11],n=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,d,f,y,m,g,qt){var A=g.length-1;switch(m){case 1:return new y.Root({},[g[A-1]]);case 2:return new y.Root({},[new y.Literal({value:""})]);case 3:this.$=new y.Concat({},[g[A-1],g[A]]);break;case 4:case 5:this.$=g[A];break;case 6:this.$=new y.Literal({value:g[A]});break;case 7:this.$=new y.Splat({name:g[A]});break;case 8:this.$=new y.Param({name:g[A]});break;case 9:this.$=new y.Optional({},[g[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:o,15:n},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:o,15:n},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,d){if(d.recoverable)this.trace(c);else{let f=function(y,m){this.message=y,this.hash=m};throw f.prototype=Error,new f(c,d)}},parse:function(c){var d=this,f=[0],y=[null],m=[],g=this.table,qt="",A=0,Ee=0,Js=2,Se=1,Ys=m.slice.call(arguments,1),_=Object.create(this.lexer),T={yy:{}};for(var Ft in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Ft)&&(T.yy[Ft]=this.yy[Ft]);_.setInput(c,T.yy),T.yy.lexer=_,T.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Bt=_.yylloc;m.push(Bt);var Gs=_.options&&_.options.ranges;typeof T.yy.parseError=="function"?this.parseError=T.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ks=function(){var F;return F=_.lex()||Se,typeof F!="number"&&(F=d.symbols_[F]||F),F},w,R,E,Vt,q={},St,S,xe,xt;;){if(R=f[f.length-1],this.defaultActions[R]?E=this.defaultActions[R]:((w===null||typeof w>"u")&&(w=Ks()),E=g[R]&&g[R][w]),typeof E>"u"||!E.length||!E[0]){var Wt="";xt=[];for(St in g[R])this.terminals_[St]&&St>Js&&xt.push("'"+this.terminals_[St]+"'");_.showPosition?Wt="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+xt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Wt="Parse error on line "+(A+1)+": Unexpected "+(w==Se?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Wt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Bt,expected:xt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+R+", token: "+w);switch(E[0]){case 1:f.push(w),y.push(_.yytext),m.push(_.yylloc),f.push(E[1]),w=null,Ee=_.yyleng,qt=_.yytext,A=_.yylineno,Bt=_.yylloc;break;case 2:if(S=this.productions_[E[1]][1],q.$=y[y.length-S],q._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},Gs&&(q._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),Vt=this.performAction.apply(q,[qt,Ee,A,T.yy,E[1],y,m].concat(Ys)),typeof Vt<"u")return Vt;S&&(f=f.slice(0,-1*S*2),y=y.slice(0,-1*S),m=m.slice(0,-1*S)),f.push(this.productions_[E[1]][0]),y.push(q.$),m.push(q._$),xe=g[f[f.length-2]][f[f.length-1]],f.push(xe);break;case 3:return!0}}return!0}},h=(function(){var u={EOF:1,parseError:function(d,f){if(this.yy.parser)this.yy.parser.parseError(d,f);else throw new Error(d)},setInput:function(c,d){return this.yy=d||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var d=c.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var d=c.length,f=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var y=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),f.length-1&&(this.yylineno-=f.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:f?(f.length===y.length?this.yylloc.first_column:0)+y[y.length-f.length].length-f[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),d=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+d+"^"},test_match:function(c,d){var f,y,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),y=c[0].match(/(?:\r\n?|\n).*/g),y&&(this.yylineno+=y.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:y?y[y.length-1].length-y[y.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],f=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),f)return f;if(this._backtrack){for(var g in m)this[g]=m[g];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,d,f,y;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),g=0;g<m.length;g++)if(f=this._input.match(this.rules[m[g]]),f&&(!d||f[0].length>d[0].length)){if(d=f,y=g,this.options.backtrack_lexer){if(c=this.test_match(f,m[g]),c!==!1)return c;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(c=this.test_match(d,m[y]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var d=this.next();return d||this.lex()},begin:function(d){this.conditionStack.push(d)},popState:function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},pushState:function(d){this.begin(d)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(d,f,y,m){switch(y){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u})();a.lexer=h;function p(){this.yy={}}return p.prototype=a,a.Parser=p,new p})();typeof Fr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Ps);function V(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var Cs={Root:V("Root"),Concat:V("Concat"),Literal:V("Literal"),Splat:V("Splat"),Param:V("Param"),Optional:V("Optional")},Os=Ps.parser;Os.yy=Cs;var Br=Os,Vr=Object.keys(Cs);function Wr(i){return Vr.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var ks=Wr,Jr=ks,Yr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ts(i){this.captures=i.captures,this.re=i.re}Ts.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Gr=Jr({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Yr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Ts({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Kr=Gr,Zr=ks,Qr=Zr({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Xr=Qr,ti=Br,ei=Kr,si=Xr;wt.prototype=Object.create(null);wt.prototype.match=function(i){var t=ei.visit(this.ast),e=t.match(i);return e||!1};wt.prototype.reverse=function(i){return si.visit(this.ast,i)};function wt(i){var t;if(this?t=this:t=Object.create(wt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=ti.parse(i),t}var ri=wt,ii=ri,ni=ii;const oi=qr(ni);var ai=Object.defineProperty,Rs=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&ai(t,e,r),r};const Ns=class extends Y{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>lt` <h1>Not Found</h1> `,this._cases=t.map(r=>({...r,route:new oi(r.path)})),this._historyObserver=new x(this,e),this._authObserver=new x(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),lt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(cs(this,"auth/redirect"),lt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):lt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),lt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),o=s+e;for(const n of this._cases){const l=n.route.match(o);if(l)return{...n,path:s,params:l,query:r}}}redirect(t){he(this,"history/redirect",{href:t})}};Ns.styles=br`
    :host,
    main {
      display: contents;
    }
  `;let Nt=Ns;Rs([xs()],Nt.prototype,"_user");Rs([xs()],Nt.prototype,"_match");const li=Object.freeze(Object.defineProperty({__proto__:null,Element:Nt,Switch:Nt},Symbol.toStringTag,{value:"Module"})),Ms=class ie extends HTMLElement{constructor(){if(super(),jt(this).template(ie.template).styles(ie.styles),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ms.template=j` <template>
    <slot name="actuator"><button>Menu</button></slot>
    <div id="panel">
      <slot></slot>
    </div>
  </template>`;Ms.styles=le`
    :host {
      position: relative;
    }
    #is-shown {
      display: none;
    }
    #panel {
      display: none;

      position: absolute;
      right: 0;
      margin-top: var(--size-spacing-small);
      width: max-content;
      padding: var(--size-spacing-small);
      border-radius: var(--size-radius-small);
      background: var(--color-background-card);
      color: var(--color-text);
      box-shadow: var(--shadow-popover);
    }
    :host([open]) #panel {
      display: block;
    }
  `;const Us=class ne extends HTMLElement{constructor(){super(),this._array=[],jt(this).template(ne.template).styles(ne.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ls("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{se(t,"button.add")?Ot(t,"input-array:add"):se(t,"button.remove")&&Ot(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],ci(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Us.template=j`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Us.styles=le`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function ci(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Ls(e)))}function Ls(i,t){const e=i===void 0?j`<input />`:j`<input value="${i}" />`;return j`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function At(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var hi=Object.defineProperty,ui=Object.getOwnPropertyDescriptor,di=(i,t,e,s)=>{for(var r=ui(t,e),o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&hi(t,e,r),r};class It extends Y{constructor(t){super(),this._pending=[],this._observer=new x(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate(),this._lastModel=this._context.value;else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}di([Ss()],It.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,ye=Ct.ShadowRoot&&(Ct.ShadyCSS===void 0||Ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),Ve=new WeakMap;let js=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ye&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ve.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ve.set(e,t))}return t}toString(){return this.cssText}};const pi=i=>new js(typeof i=="string"?i:i+"",void 0,ge),zt=(i,...t)=>{const e=i.length===1?i[0]:t.reduce(((s,r,o)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[o+1]),i[0]);return new js(e,i,ge)},fi=(i,t)=>{if(ye)i.adoptedStyleSheets=t.map((e=>e instanceof CSSStyleSheet?e:e.styleSheet));else for(const e of t){const s=document.createElement("style"),r=Ct.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},We=ye?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return pi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:mi,defineProperty:yi,getOwnPropertyDescriptor:gi,getOwnPropertyNames:vi,getOwnPropertySymbols:_i,getPrototypeOf:$i}=Object,O=globalThis,Je=O.trustedTypes,bi=Je?Je.emptyScript:"",Gt=O.reactiveElementPolyfillSupport,dt=(i,t)=>i,Mt={toAttribute(i,t){switch(t){case Boolean:i=i?bi:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},ve=(i,t)=>!mi(i,t),Ye={attribute:!0,type:String,converter:Mt,reflect:!1,useDefault:!1,hasChanged:ve};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),O.litPropertyMetadata??(O.litPropertyMetadata=new WeakMap);let J=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ye){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&yi(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:o}=gi(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get:r,set(n){const l=r==null?void 0:r.call(this);o==null||o.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ye}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=$i(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,s=[...vi(e),..._i(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(We(r))}else t!==void 0&&e.push(We(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise((e=>this.enableUpdating=e)),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach((e=>e(this)))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach((e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)}))}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach((e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)}))}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){var o;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const n=(((o=s.converter)==null?void 0:o.toAttribute)!==void 0?s.converter:Mt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){var o,n;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const l=s.getPropertyOptions(r),a=typeof l.converter=="function"?{fromAttribute:l.converter}:((o=l.converter)==null?void 0:o.fromAttribute)!==void 0?l.converter:Mt;this._$Em=r;const h=a.fromAttribute(e,l.type);this[r]=h??((n=this._$Ej)==null?void 0:n.get(r))??h,this._$Em=null}}requestUpdate(t,e,s){var r;if(t!==void 0){const o=this.constructor,n=this[t];if(s??(s=o.getPropertyOptions(t)),!((s.hasChanged??ve)(n,e)||s.useDefault&&s.reflect&&n===((r=this._$Ej)==null?void 0:r.get(t))&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:r,wrapped:o},n){s&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,n??e??this[t]),o!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[o,n]of r){const{wrapped:l}=n,a=this[o];l!==!0||this._$AL.has(o)||a===void 0||this.C(o,void 0,n,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach((r=>{var o;return(o=r.hostUpdate)==null?void 0:o.call(r)})),this.update(e)):this._$EM()}catch(r){throw t=!1,this._$EM(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach((s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach((e=>this._$ET(e,this[e])))),this._$EM()}updated(t){}firstUpdated(t){}};J.elementStyles=[],J.shadowRootOptions={mode:"open"},J[dt("elementProperties")]=new Map,J[dt("finalized")]=new Map,Gt==null||Gt({ReactiveElement:J}),(O.reactiveElementVersions??(O.reactiveElementVersions=[])).push("2.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt=globalThis,Ut=pt.trustedTypes,Ge=Ut?Ut.createPolicy("lit-html",{createHTML:i=>i}):void 0,Hs="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Is="?"+C,wi=`<${Is}>`,z=document,_t=()=>z.createComment(""),$t=i=>i===null||typeof i!="object"&&typeof i!="function",_e=Array.isArray,Ai=i=>_e(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Kt=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ke=/-->/g,Ze=/>/g,M=RegExp(`>|${Kt}(?:([^\\s"'>=/]+)(${Kt}*=${Kt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Qe=/'/g,Xe=/"/g,zs=/^(?:script|style|textarea|title)$/i,Ei=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),v=Ei(1),st=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ts=new WeakMap,L=z.createTreeWalker(z,129);function Ds(i,t){if(!_e(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ge!==void 0?Ge.createHTML(t):t}const Si=(i,t)=>{const e=i.length-1,s=[];let r,o=t===2?"<svg>":t===3?"<math>":"",n=ct;for(let l=0;l<e;l++){const a=i[l];let h,p,u=-1,c=0;for(;c<a.length&&(n.lastIndex=c,p=n.exec(a),p!==null);)c=n.lastIndex,n===ct?p[1]==="!--"?n=Ke:p[1]!==void 0?n=Ze:p[2]!==void 0?(zs.test(p[2])&&(r=RegExp("</"+p[2],"g")),n=M):p[3]!==void 0&&(n=M):n===M?p[0]===">"?(n=r??ct,u=-1):p[1]===void 0?u=-2:(u=n.lastIndex-p[2].length,h=p[1],n=p[3]===void 0?M:p[3]==='"'?Xe:Qe):n===Xe||n===Qe?n=M:n===Ke||n===Ze?n=ct:(n=M,r=void 0);const d=n===M&&i[l+1].startsWith("/>")?" ":"";o+=n===ct?a+wi:u>=0?(s.push(h),a.slice(0,u)+Hs+a.slice(u)+C+d):a+C+(u===-2?l:d)}return[Ds(i,o+(i[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class bt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let o=0,n=0;const l=t.length-1,a=this.parts,[h,p]=Si(t,e);if(this.el=bt.createElement(h,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=L.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Hs)){const c=p[n++],d=r.getAttribute(u).split(C),f=/([.?@])?(.*)/.exec(c);a.push({type:1,index:o,name:f[2],strings:d,ctor:f[1]==="."?Pi:f[1]==="?"?Ci:f[1]==="@"?Oi:Dt}),r.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:o}),r.removeAttribute(u));if(zs.test(r.tagName)){const u=r.textContent.split(C),c=u.length-1;if(c>0){r.textContent=Ut?Ut.emptyScript:"";for(let d=0;d<c;d++)r.append(u[d],_t()),L.nextNode(),a.push({type:2,index:++o});r.append(u[c],_t())}}}else if(r.nodeType===8)if(r.data===Is)a.push({type:2,index:o});else{let u=-1;for(;(u=r.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:o}),u+=C.length-1}o++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function rt(i,t,e=i,s){var n,l;if(t===st)return t;let r=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const o=$t(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==o&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),o===void 0?r=void 0:(r=new o(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=rt(i,r._$AS(i,t.values),r,s)),t}class xi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??z).importNode(e,!0);L.currentNode=r;let o=L.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let h;a.type===2?h=new Et(o,o.nextSibling,this,t):a.type===1?h=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(h=new ki(o,this,t)),this._$AV.push(h),a=s[++l]}n!==(a==null?void 0:a.index)&&(o=L.nextNode(),n++)}return L.currentNode=z,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Et{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=rt(this,t,e),$t(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ai(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&$t(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=bt.createElement(Ds(s.h,s.h[0]),this.options)),s);if(((o=this._$AH)==null?void 0:o._$AD)===r)this._$AH.p(e);else{const n=new xi(r,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=ts.get(t.strings);return e===void 0&&ts.set(t.strings,e=new bt(t)),e}k(t){_e(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const o of t)r===e.length?e.push(s=new Et(this.O(_t()),this.O(_t()),this,this.options)):s=e[r],s._$AI(o),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,o){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=o,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const o=this.strings;let n=!1;if(o===void 0)t=rt(this,t,e,0),n=!$t(t)||t!==this._$AH&&t!==st,n&&(this._$AH=t);else{const l=t;let a,h;for(t=o[0],a=0;a<o.length-1;a++)h=rt(this,l[s+a],e,a),h===st&&(h=this._$AH[a]),n||(n=!$t(h)||h!==this._$AH[a]),h===b?t=b:t!==b&&(t+=(h??"")+o[a+1]),this._$AH[a]=h}n&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Pi extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Ci extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Oi extends Dt{constructor(t,e,s,r,o){super(t,e,s,r,o),this.type=5}_$AI(t,e=this){if((t=rt(this,t,e,0)??b)===st)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class ki{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){rt(this,t)}}const Zt=pt.litHtmlPolyfillSupport;Zt==null||Zt(bt,Et),(pt.litHtmlVersions??(pt.litHtmlVersions=[])).push("3.3.1");const Ti=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const o=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Et(t.insertBefore(_t(),o),o,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=globalThis;class ft extends J{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ti(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return st}}var ss;ft._$litElement$=!0,ft.finalized=!0,(ss=H.litElementHydrateSupport)==null||ss.call(H,{LitElement:ft});const Qt=H.litElementPolyfillSupport;Qt==null||Qt({LitElement:ft});(H.litElementVersions??(H.litElementVersions=[])).push("4.2.1");const Ri={};function Ni(i,t,e){var n,l;const[s,r,o]=i;switch(console.log("Processing",s,"message",i),console.log("User in update:",e),s){case"profile/request":{const{userid:h}=r;if(((n=t.profile)==null?void 0:n.userid)===h)break;return[{...t,profile:{userid:h}},Mi({userid:h},e).then(p=>["profile/load",{userid:h,profile:p}])]}case"profile/load":{const{profile:h}=r;return{...t,profile:h}}case"memories/request":{const{userid:h}=r;return[t,Ui({},e).then(p=>["memories/load",{memories:p}])]}case"memories/load":{const{memories:h}=r;return{...t,memories:{memories:h,memoryid:"",userid:""}}}case"profile/save":{const{userid:h}=r;return[t,Li(r,e,o||{}).then(p=>["profile/load",{userid:h,profile:p}])]}case"memory/save":{const{memoryid:h,memory:p}=r;return[t,ji({memoryid:h,memory:p},e,o||{}).then(u=>["memory/saved",{memory:u}])]}case"memory/saved":{const{memory:h}=r,p=((l=t.memories)==null?void 0:l.memories)??[],u=p.findIndex(d=>d.memoryid===h.memoryid),c=u>=0?[...p.slice(0,u),h,...p.slice(u+1)]:[...p,h];return{...t,memories:{...t.memories,memories:c,memoryid:h.memoryid,userid:h.userid}}}default:const a=s;throw new Error(`Unhandled message "${a}"`)}return t}function Mi(i,t){return fetch(`/api/users/${i.userid}`,{headers:Q.headers(t)}).then(e=>{if(e.status===200)return e.json();throw"No Response from server"}).then(e=>{if(e)return e;throw"No JSON in response from server"})}function Ui(i,t){return fetch("/api/memory",{headers:Q.headers(t)}).then(e=>{if(e.status===200)return e.json();throw"No Response from server"}).then(e=>{if(Array.isArray(e))return e;throw"No JSON array in response from server"})}function Li(i,t,e){return fetch(`/api/users/${i.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...Q.headers(t)},body:JSON.stringify(i.profile)}).then(s=>{if(s.status===200)return s.json();throw new Error(`Failed to save profile for ${i.userid}`)}).then(s=>{if(s)return e.onSuccess&&e.onSuccess(),s;throw new Error("No JSON in API response")}).catch(s=>{throw e.onFailure&&e.onFailure(s),s})}function ji(i,t,e){const s=i.memoryid==="new"||!i.memoryid,r=s?"/api/memory":`/api/memory/${i.memoryid}`,o=s?"POST":"PUT";return console.log("Saving memory:",{url:r,method:o,memory:i.memory}),console.log("Auth headers:",Q.headers(t)),fetch(r,{method:o,headers:{"Content-Type":"application/json",...Q.headers(t)},body:JSON.stringify(i.memory)}).then(n=>(console.log("Save memory response:",n.status,n.statusText),n.status===200||n.status===201?n.json():n.text().then(l=>{throw console.error("Error response body:",l),new Error(`Failed to save memory: ${n.status} ${l}`)}))).then(n=>{if(console.log("Save memory JSON:",n),n)return e.onSuccess&&e.onSuccess(),n;throw new Error("No JSON in API response")}).catch(n=>{throw console.error("Save memory error:",n),e.onFailure&&e.onFailure(n),n})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hi={attribute:!0,type:String,converter:Mt,reflect:!1,hasChanged:ve},Ii=(i=Hi,t,e)=>{const{kind:s,metadata:r}=e;let o=globalThis.litPropertyMetadata.get(r);if(o===void 0&&globalThis.litPropertyMetadata.set(r,o=new Map),s==="setter"&&((i=Object.create(i)).wrapped=!0),o.set(e.name,i),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,i)},init(l){return l!==void 0&&this.C(n,void 0,i,l),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,i)}}throw Error("Unsupported decorator location: "+s)};function qs(i){return(t,e)=>typeof e=="object"?Ii(i,t,e):((s,r,o)=>{const n=r.hasOwnProperty(o);return r.constructor.createProperty(o,s),n?Object.getOwnPropertyDescriptor(r,o):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function k(i){return qs({...i,state:!0,attribute:!1})}var zi=Object.defineProperty,Fs=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&zi(t,e,r),r},G;let $e=(G=class extends ft{constructor(){super(...arguments),this._authObserver=new x(this,"thegarden:auth"),this.loggedIn=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{this._authModel=t;const{user:e}=t||{};console.log("user:",e),console.log("user.authenticated:",e==null?void 0:e.authenticated),e&&e.authenticated?(this.loggedIn=!0,this.userid=e.username):(this.loggedIn=!1,this.userid=void 0),this.requestUpdate()}),window.addEventListener("auth:updated",()=>{console.log("Auth updated event received, requesting update"),this.requestUpdate()})}updateAuthState(t,e,s){this._authModel&&(console.log("Updating auth state in header:",{authenticated:t,username:e}),this._authModel.user={authenticated:t,username:e||"anonymous",token:s},this.loggedIn=t,this.userid=e,this.requestUpdate())}renderSignOutButton(){return v`
      <button
        @click=${t=>{try{localStorage.clear()}catch{}cr.relay(t,"auth:message",["auth/signout"])}}
      >
        Sign Out
      </button>
    `}renderSignInButton(){return v`
      <a href="/login.html" @click=${()=>{const t=window.top??window;t.location.href="/login.html"}}>Sign in</a>
    `}render(){return console.log("render - loggedIn:",this.loggedIn,"userid:",this.userid),v`
      <header>
        <div class="brand">
          <a href="/app"><h1>The Garden</h1></a>
        </div>
        <div class="right">
          <div class="content">
            <nav class="Couple"><a href="/app/couple"><h2>Couple</h2></a></nav>
          </div>
          <div class="meta">
          <span class="userid">Hello, ${this.userid||"guest"}</span>
            ${this.loggedIn?this.renderSignOutButton():this.renderSignInButton()}
          </div>
        </div>
      </header>
    `}},G.styles=zt`
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
  `,G);Fs([k()],$e.prototype,"loggedIn");Fs([k()],$e.prototype,"userid");var Di=Object.defineProperty,qi=Object.getOwnPropertyDescriptor,Bs=(i,t,e,s)=>{for(var r=s>1?void 0:s?qi(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Di(t,e,r),r};const we=class we extends It{constructor(){super("thegarden:model"),this._authObserver=new x(this,"thegarden:auth")}get profile(){return this.model.profile}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t||{};e&&e.authenticated&&e.username&&!this.userid?(this.userid=e.username,this.dispatchMessage(["profile/request",{userid:e.username}])):(!e||!e.authenticated)&&(this.userid=void 0)})}render(){return this.profile&&this.profile.userid?v`
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
      `:v`
      <section class="home">
        <h2>Welcome to The Garden</h2>
        <p>This site helps you save and browse shared memories.</p>
        <p>
          <a href="/login.html" @click=${this.handleLogin}>Sign in</a> to see your memories.
        </p>
      </section>
    `}handleLogin(){const t=window.top??window;t.location.href="/login.html"}};we.styles=zt`
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
  `;let it=we;Bs([k()],it.prototype,"userid",2);Bs([k()],it.prototype,"profile",1);At({"home-view":it});var Fi=Object.defineProperty,Vs=(i,t,e,s)=>{for(var r=void 0,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=n(t,e,r)||r);return r&&Fi(t,e,r),r};const Ae=class Ae extends It{constructor(){super("thegarden:model"),this._authObserver=new x(this,"thegarden:auth"),this.requested=!1}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t||{};if(e&&e.authenticated&&e.username){const s=e.username,r=this.userid&&this.userid!==s;this.userid=s,(!this.requested||r)&&(this.requested=!0,this.dispatchMessage(["memories/request",{userid:s}]))}else this.userid=void 0,this.requested=!1})}get memories(){var t;return((t=this.model.memories)==null?void 0:t.memories)??[]}render(){if(!this.userid)return v`
        <section class="memories">
          <h2>Memories</h2>
          <p>Please <a href="/login.html" @click=${this.handleLogin}>sign in</a> to view memories.</p>
        </section>
      `;const t=this.memories;return v`
      <section class="memories">
        <header class="memories-header">
          <h2>Memories</h2>
          <button class="add-btn" @click=${this.handleAddMemory}>
            + Add Memory
          </button>
        </header>
        ${t.length===0?v`<p>No memories yet. Click "Add Memory" to create your first one!</p>`:v`
              <div class="memories-grid">
                ${t.map(e=>this.renderCard(e))}
              </div>
            `}
      </section>
    `}renderCard(t){var s,r;const e=t.date?((r=(s=t.date).toLocaleDateString)==null?void 0:r.call(s))||new Date(t.date).toLocaleDateString():"";return v`
      <article class="memory-card" @click=${()=>this.handleEditMemory(t.memoryid)}>
        <header>
          <h3>${t.name}</h3>
          <span class="date">${e}</span>
        </header>
        <div class="location">📍 ${t.location}</div>
        ${t.description?v`<p>${t.description}</p>`:null}
      </article>
    `}handleLogin(){const t=window.top??window;t.location.href="/login.html"}handleAddMemory(){mt.dispatch(this,"history/navigate",{href:"/app/memories/new"})}handleEditMemory(t){mt.dispatch(this,"history/navigate",{href:`/app/memories/${t}/edit`})}};Ae.styles=zt`
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
  `;let nt=Ae;Vs([k()],nt.prototype,"userid");Vs([k()],nt.prototype,"requested");At({"memories-view":nt});var Bi=Object.defineProperty,Vi=Object.getOwnPropertyDescriptor,be=(i,t,e,s)=>{for(var r=s>1?void 0:s?Vi(t,e):t,o=i.length-1,n;o>=0;o--)(n=i[o])&&(r=(s?n(t,e,r):n(r))||r);return s&&r&&Bi(t,e,r),r};const Lt=class Lt extends It{constructor(){super("thegarden:model"),this._authObserver=new x(this,"thegarden:auth")}get memory(){var e;return!this.memoryid||this.memoryid==="new"?void 0:(((e=this.model.memories)==null?void 0:e.memories)??[]).find(s=>s.memoryid===this.memoryid)}connectedCallback(){super.connectedCallback(),this._authObserver.observe(t=>{const{user:e}=t||{};e&&e.authenticated&&e.username?this.userid=e.username:this.userid=void 0})}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="memory-id"&&e!==s&&s&&s!=="new"&&this.dispatchMessage(["memories/request",{userid:this.userid||""}])}handleSubmit(t){this.dispatchMessage(["memory/save",{memoryid:this.memoryid||"new",memory:t.detail},{onSuccess:()=>mt.dispatch(this,"history/navigate",{href:"/app/memories"}),onFailure:e=>console.log("ERROR:",e)}])}handleCancel(){mt.dispatch(this,"history/navigate",{href:"/app/memories"})}render(){if(!this.userid)return v`
        <section class="memory-edit">
          <h2>Edit Memory</h2>
          <p>Please <a href="/login.html">sign in</a> to edit memories.</p>
        </section>
      `;const t=this.memory||{name:"",location:"",date:new Date().toISOString().split("T")[0],description:""};return v`
      <section class="memory-edit">
        <h2>${this.memoryid==="new"?"Add New Memory":"Edit Memory"}</h2>
        <mu-form .init=${t} @mu-form:submit=${this.handleSubmit}>
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
    `}};Lt.uses=At({"mu-form":pr.Element}),Lt.styles=zt`
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
  `;let D=Lt;be([qs()],D.prototype,"memoryid",2);be([k()],D.prototype,"userid",2);be([k()],D.prototype,"memory",1);At({"memory-edit":D});const Wi=[{path:"/app/couple",view:()=>v`
      <section class="couple">
        <iframe src="/couple.html?embed=1" style="width:100%;height:80vh;border:0"></iframe>
      </section>
    `},{path:"/app/memories/new",view:()=>v`
      <memory-edit memory-id="new"></memory-edit>
    `},{path:"/app/memories/:id/edit",view:i=>v`
      <memory-edit memory-id=${i.id}></memory-edit>
    `},{path:"/app/memories",view:()=>v`
      <memories-view></memories-view>
    `},{path:"/app/partner1",view:()=>v`
      <section class="partner">
        <iframe src="/partner1.html?embed=1" style="width:100%;height:80vh;border:0"></iframe>
      </section>
    `},{path:"/app/partner2",view:()=>v`
      <section class="partner">
        <iframe src="/partner2.html?embed=1" style="width:100%;height:80vh;border:0"></iframe>
      </section>
    `},{path:"/app",view:()=>v`
        <home-view></home-view>
    `},{path:"/",redirect:"/app"}];At({"mu-auth":Q.Provider,"mu-history":mt.Provider,"mu-switch":class extends li.Element{constructor(){super(Wi,"thegarden:history","thegarden:auth")}},"mu-store":class extends _r.Provider{constructor(){super(Ni,Ri,"thegarden:auth")}},"thegarden-header":$e,"home-view":it,"memories-view":nt,"memory-edit":D});function Ji(){try{return localStorage.getItem("thegarden:token")}catch{return null}}async function Ws(i){if(i)try{const t=await fetch("/api/users/me",{headers:{Authorization:`Bearer ${i}`}});if(t.ok){const e=await t.json();console.log("User info fetched:",e);const s=document.querySelector("thegarden-header");s&&typeof s.updateAuthState=="function"&&(console.log("Calling header.updateAuthState with:",e),s.updateAuthState(e.authenticated,e.username,i))}else{console.log("Token validation failed, clearing localStorage");try{localStorage.clear()}catch{}}}catch(t){console.error("Failed to fetch user info:",t);try{localStorage.clear()}catch{}}}const es=Ji();es&&(console.log("Found stored token, updating auth"),setTimeout(()=>{Ws(es)},100));let Xt=!1;window.addEventListener("auth:message",async i=>{const[t,e]=i.detail||[];t==="auth/signin"&&(e!=null&&e.token)&&!Xt&&(Xt=!0,console.log("Auth signin message received with token"),await Ws(e.token),Xt=!1)});typeof TheGardenHeader.initializeOnce=="function"&&TheGardenHeader.initializeOnce();
