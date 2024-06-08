import BaseComponent from './BaseComponent';

export default class Button extends BaseComponent<HTMLButtonElement> {
  constructor(props: { text: string; classes?: string[] }) {
    super({ tag: 'button', text: props.text, classes: props.classes });
  }

  enable(): void {
    this.node.disabled = false;
  }

  disable(): void {
    this.node.disabled = true;
  }
}
