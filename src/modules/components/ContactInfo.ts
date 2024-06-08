import BaseComponent from './BaseComponent';

export default class ContactInfo extends BaseComponent {
  name: BaseComponent;

  status: BaseComponent;

  constructor() {
    super({ classes: ['chat-user'] });
    this.name = new BaseComponent({
      tag: 'p',
      classes: ['chat-user__name'],
    });
    this.status = new BaseComponent({
      tag: 'p',
      classes: ['chat-user__status'],
    });

    this.append(this.name);
    this.append(this.status);
  }

  setName(value: string): void {
    this.name.setTextContent(value);
  }

  setStatus(value: string): void {
    this.status.setTextContent(value);
    this.status.removeClass('online');
    this.status.removeClass('offline');
    this.status.addClass(value);
  }

  setInfo(name: string, status: string): void {
    this.setName(name);
    this.setStatus(status);
  }
}
