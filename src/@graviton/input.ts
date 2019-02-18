import { LitElement, html, customElement, property } from '@polymer/lit-element';
import { accent } from './shared';

@customElement('gvt-input')
export class GvtInput extends LitElement {

  @property({type:String})
  type: string = '';

  @property({type:String})
  autocomplete: string = '';

  @property({type:String})
  value: string = '';

  render() {
    return html`
              <style>
                * {
                  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
                }
                .fieldInput {
                  box-sizing:border-box;
                  padding:0px 12px;
                  min-width:17.5rem;
                  height:3.5rem;
                  background:transparent;
                  border:0px;
                  position:relative;
                  font-size:16pt;
                  z-index:3;
                  width:100%;
                }
                .highlight {
                  content:"";
                  position:absolute;
                  bottom:0px;
                  width:100%;
                  height:1px;
                  background-color:#bdbdbd;
                  transition:color 0.2s cubic-bezier(1,0,0,1);
                  pointer-events:none;
                }
                .fieldInputLabel {
                  z-index:1;
                  position:absolute;
                  top:12.5px;
                  left:2px;
                  color:#222;
                  transition:transform 0.2s cubic-bezier(1,0,0,1), font-size 0.2s cubic-bezier(1,0,0,1), color 0.2s cubic-bezier(1,0,0,1);
                  transform:translate(0px,-24px);
                  font-size:12px;
                  pointer-events:none;
                }
                supports:placeholder-shown,.fieldInputLabel {
                  transform:translate(0px,0px);
                  font-size:16px;
                }
                .fieldInput:focus {
                  outline: none;
                }
                .fieldInput:focus ~ .highlight {
                  background-color:${accent};
                }
                .fieldInput:focus ~ .fieldInputLabel {
                  color:${accent};
                }
                .fieldInput:focus ~ .fieldInputLabel, .fieldInput:not(:placeholder-shown) ~ .fieldInputLabel {
                  transform:translate(0px,-24px);
                  font-size:12px;
                }
                .inputContainer {
                  position:relative;
                  margin-top:12px;
                }
              </style>
              <div class="inputContainer">
                <input .value=${this.value} @input=${(e: any)=> {
                  this.value = e.target.value;
                }} class="fieldInput" placeholder=" " type="${this.type}" autocomplete="${this.autocomplete}">
                <label class="fieldInputLabel"><slot></slot></label>
                <div class="highlight"></div>
              </div>`;
  }
}