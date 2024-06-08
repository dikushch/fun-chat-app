import BaseComponent from './BaseComponent';
import Button from './Button';

export default class MsgContextmenu extends BaseComponent {
  delete: Button;

  edit: Button;

  id: string;

  text: string;

  constructor(id: string, text: string, x: number, y: number) {
    super({ classes: ['c-menu'] });
    this.id = id;
    this.text = text;
    this.delete = new Button({
      text: 'delete',
      classes: ['c-menu__btn', 'c-menu__btn--delete'],
    });
    this.edit = new Button({
      text: 'edit',
      classes: ['c-menu__btn', 'c-menu__btn--edit'],
    });
    const container = new BaseComponent(
      { classes: ['c-menu__container'] },
      this.delete,
      this.edit,
    );
    container.getNode().style.left = `${x}px`;
    container.getNode().style.top = `${y}px`;

    this.append(container);

    this.addListener('click', (e) => {
      this.closeHandler(e);
    });

    this.delete.addListener('click', () => {
      this.dispatchDelMsgEvent(this.id);
      this.destroy();
    });

    this.edit.addListener('click', () => {
      this.dispatchChangeMsgEvent(this.id, this.text);
      this.destroy();
    });
  }

  open(): void {
    document.body.append(this.getNode());
  }

  close(): void {
    this.destroy();
  }

  closeHandler(e: Event): void {
    if (e.target === this.getNode()) {
      this.close();
    }
  }

  dispatchDelMsgEvent(id: string): void {
    const event = new CustomEvent('delete-msg', {
      bubbles: true,
      detail: id,
    });
    this.getNode().dispatchEvent(event);
  }

  dispatchChangeMsgEvent(id: string, text: string): void {
    const event = new CustomEvent('change-msg', {
      bubbles: true,
      detail: { id, text },
    });
    this.getNode().dispatchEvent(event);
  }
}
