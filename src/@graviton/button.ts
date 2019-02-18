import { LitElement, html, customElement, property } from '@polymer/lit-element';
import { accent } from './shared';

@customElement('gvt-button')
export class GravitonButton extends LitElement {
  
  @property({type:Boolean})
  disabled: boolean = false;

  render() {
    return html`
      <style>
        .btn {
          box-sizing:border-box;
          display:inline-block;
          background-color:${accent};
          min-width:4rem;
          height:2.25rem;
          padding:0rem 1rem;
          border:0px;
          color:white;
          border-radius:1.125rem;
          box-shadow: 0px 3px 6px rgba(33, 150, 243, 0.16);
          font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
        }
        .btn:disabled {
          background-color:#e3e3e3;
          color:black;
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        }
        .btn-wrapping {
          display:inline-block;
          margin:0.25rem 0rem;
        }
      </style>
      <div class="btn-wrapping">
        <button ?disabled=${this.disabled} class="btn">
          <slot></slot>
        </button>
      </div>
    `;
  }

}