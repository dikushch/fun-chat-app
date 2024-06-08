import BaseComponent from './BaseComponent';

export default class ErrMsg extends BaseComponent {
  constructor(errText: string) {
    super({ classes: ['err-msg'] });
    const msg = new BaseComponent({
      tag: 'p',
      text: errText,
      classes: ['err-msg__text'],
    });
    this.append(msg);
    this.removeMsg();
  }

  removeMsg(): void {
    setTimeout(() => {
      this.destroy();
    }, 2000);
  }
}
