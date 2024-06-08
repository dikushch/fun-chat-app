import BaseComponent from './BaseComponent';
import Button from './Button';
import Input from './Input';

export default class AuthForm extends BaseComponent {
  name: Input;

  password: Input;

  submitBtn: Button;

  infoBtn: Button;

  constructor() {
    super({ tag: 'form', classes: ['auth__form'] });
    this.name = new Input({
      type: 'name',
      id: 'name',
      classes: ['auth__input', 'auth__input--name'],
    });
    this.password = new Input({
      type: 'password',
      id: 'password',
      classes: ['auth__input', 'auth__input--pass'],
    });
    this.submitBtn = new Button({
      text: 'log in',
      classes: ['auth__btn', 'auth__btn--login'],
    });
    this.submitBtn.setAttribute('type', 'submit');
    this.submitBtn.disable();
    this.infoBtn = new Button({
      text: 'info',
      classes: ['auth__btn', 'auth__btn--info'],
    });
    this.infoBtn.setAttribute('type', 'button');
    const nameLabel = new BaseComponent({
      tag: 'label',
      text: 'name',
      classes: ['auth__label'],
    });
    nameLabel.setAttribute('for', 'name');
    const passLabel = new BaseComponent({
      tag: 'label',
      text: 'password',
      classes: ['auth__label'],
    });
    passLabel.setAttribute('for', 'password');

    const nameTip = new BaseComponent({
      text: '- English alphabet letters and numbers\n- minimum length 4 characters',
      classes: ['auth__tip'],
    });

    const passTip = new BaseComponent({
      text: '- One English alphabet UPPERCASE letter\n- minimum length 4 characters',
      classes: ['auth__tip'],
    });

    const nameContainer = new BaseComponent(
      { classes: ['auth__box'] },
      nameLabel,
      this.name,
      nameTip,
    );
    const passContainer = new BaseComponent(
      { classes: ['auth__box'] },
      passLabel,
      this.password,
      passTip,
    );

    this.append(nameContainer);
    this.append(passContainer);
    this.append(this.submitBtn);
    this.append(this.infoBtn);
  }
}
