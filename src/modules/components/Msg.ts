import { MsgData, MsgStatus } from '../types/Types';
import BaseComponent from './BaseComponent';

export default class Msg extends BaseComponent {
  id: string;

  text: BaseComponent;

  status: BaseComponent;

  edit: BaseComponent;

  msgStatus: string = '';

  msgEdit: string = '';

  constructor(msgData: MsgData, currentUser: string) {
    super({ tag: 'li', classes: ['msg'] });
    this.id = msgData.id;
    this.setAttribute('data-id', `${this.id}`);
    const from = new BaseComponent({
      tag: 'p',
      text: msgData.from,
      classes: ['msg__from'],
    });
    const date = new BaseComponent({
      tag: 'p',
      text: `${new Date(msgData.datetime).toLocaleString()}`,
      classes: ['msg__date'],
    });
    const msgTop = new BaseComponent({ classes: ['msg__top'] }, from, date);

    this.text = new BaseComponent({
      tag: 'p',
      text: msgData.text,
      classes: ['msg__text'],
    });

    this.status = new BaseComponent({
      tag: 'p',
      text: this.setStatus(msgData.status),
      classes: ['msg__status'],
    });

    this.edit = new BaseComponent({
      tag: 'p',
      text: this.setEdit(msgData.status),
      classes: ['msg__edit'],
    });

    const msgBot = new BaseComponent(
      { classes: ['msg__bot'] },
      this.edit,
      this.status,
    );

    if (msgData.from === currentUser) {
      this.addClass('my');
      from.setTextContent('you');
      this.status.addClass('visible');
    }

    this.append(msgTop);
    this.append(this.text);
    this.append(msgBot);
  }

  setStatus(status: MsgStatus): string {
    let currentStatus = 'sent';
    if (status.isDelivered) {
      currentStatus = 'delived';
    }
    if (status.isReaded) {
      currentStatus = 'read';
    }
    this.msgStatus = currentStatus;
    return currentStatus;
  }

  setEdit(status: MsgStatus): string {
    let edit = '';
    if (status.isEdited) {
      edit = 'edited';
    }
    this.msgEdit = edit;
    return edit;
  }
}
