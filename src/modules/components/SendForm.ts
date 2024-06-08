import BaseComponent from './BaseComponent';
import Button from './Button';
import Input from './Input';

export default class SendForm extends BaseComponent {
  input: Input;

  sendBtn: Button;

  constructor() {
    super({ tag: 'form', classes: ['send-form'] });
    this.input = new Input({ type: 'text', classes: ['send-form__input'] });
    this.sendBtn = new Button({ text: 'send', classes: ['send-form__btn'] });
    this.sendBtn.setAttribute('type', 'submit');
    this.disable();

    this.append(this.input);
    this.append(this.sendBtn);

    this.addListener('submit', (e) => {
      e.preventDefault();
    });

    this.input.addListener('input', () => {
      this.checkInput();
    });
  }

  resetForm(): void {
    this.input.clearValue();
    this.sendBtn.disable();
  }

  disable(): void {
    this.input.disable();
    this.sendBtn.disable();
  }

  enable(): void {
    this.input.enable();
    this.checkInput();
  }

  checkInput(): void {
    if (this.input.getValue()) {
      this.sendBtn.enable();
    } else {
      this.sendBtn.disable();
    }
  }

  getMsg(): string {
    return this.input.getValue();
  }
}
