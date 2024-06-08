import AuthForm from '../components/AuthForm';
import BaseComponent from '../components/BaseComponent';
import Button from '../components/Button';
import Input from '../components/Input';

export default class AuthPage extends BaseComponent {
  form: AuthForm;

  name: Input;

  password: Input;

  submit: Button;

  info: Button;

  isNameValid: boolean = false;

  isPassValid: boolean = false;

  constructor() {
    super({ tag: 'section', classes: ['auth'] });
    this.form = new AuthForm();
    this.name = this.form.name;
    this.password = this.form.password;
    this.submit = this.form.submitBtn;
    this.info = this.form.infoBtn;

    this.append(this.form);

    this.name.addListener('input', () => {
      this.isNameValid = AuthPage.checkInputValue(this.name, /[A-Za-z0-9]{4,}/);
      this.checkInputs();
    });

    this.password.addListener('input', () => {
      this.isPassValid = AuthPage.checkInputValue(
        this.password,
        /(?=.*[A-Z]).{4,}/,
      );
      this.checkInputs();
    });

    this.submit.addListener('click', () => {
      this.dispathLoginEvent();
      this.clearForm();
    });

    this.info.addListener('click', () => {
      this.dispathOpenInfoEvent();
    });

    this.form.addListener('submit', (e) => {
      e.preventDefault();
    });
  }

  checkInputs(): void {
    if (this.isNameValid && this.isPassValid) {
      this.submit.enable();
    } else {
      this.submit.disable();
    }
  }

  static checkInputValue(inputNode: Input, regExp: RegExp): boolean {
    const value = inputNode.getValue();
    if (regExp.test(value)) {
      inputNode.addClass('ok');
      inputNode.removeClass('wrong');
      return true;
    }

    inputNode.addClass('wrong');
    inputNode.removeClass('ok');
    return false;
  }

  clearForm(): void {
    this.name.clearValue();
    this.name.removeClass('ok');
    this.password.clearValue();
    this.password.removeClass('ok');
    this.submit.disable();
    this.isNameValid = false;
    this.isPassValid = false;
  }

  dispathLoginEvent(): void {
    const login = this.name.getValue();
    const password = this.password.getValue();
    const event = new CustomEvent('login', {
      bubbles: true,
      detail: { login, password },
    });
    this.getNode().dispatchEvent(event);
  }

  dispathOpenInfoEvent(): void {
    const event = new CustomEvent('info', {
      bubbles: true,
    });
    this.getNode().dispatchEvent(event);
  }
}
