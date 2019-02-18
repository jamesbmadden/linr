import { LitElement, html, customElement, property } from '@polymer/lit-element';

@customElement('gvt-tab-bar')
export class GvtTabBar extends LitElement {
  
  @property()
  tabs: Array<String> = [];
  
  @property()
  selected: Number = 0;

  @property()
  id: string = '';

  connectedCallback() {
    document.dispatchEvent(new CustomEvent(`tabs-created-${this.id}`, {detail:{element:this}}));
  }

  render() {
    return html`<div>${this.tabs.map((tab, index) => {
      html`<gvt-tab selected=${this.selected == index} index=${index} .tabChange=${(tab: Number) => {
        this.selected = tab;
        this.dispatchEvent(new CustomEvent('tab-change', {detail:{tab:tab}}));
      }}>${tab}</gvt-tab>`;
    })}</div>`;
  }

}

@customElement('gvt-tab')
export class GvtTab extends LitElement {

  @property()
  selected: Boolean = false;

  render() {
    return html`<div><span><slot></slot></span></div>`;
  }

}

@customElement('gvt-tab-view')
export class GvtTabView extends LitElement {

  @property()
  selected: Number = 0;

  @property()
  for: String = '';

  tabBar: any = null;

  connectedCallback() {
    document.addEventListener(`tabs-created-${this.for}`, (event: CustomEvent) => {
      this.tabBar = event.detail.element;
      this.selected = this.tabBar.selected;
      this.tabBar.addEventListener('tab-change', (event: CustomEvent) => {
        this.selected = event.detail.tab;
      });
    });
  }

}