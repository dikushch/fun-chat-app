import BaseComponent from './BaseComponent';

export default class Input extends BaseComponent<HTMLInputElement> {
  constructor(props: { type: string; id?: string; classes?: string[] }) {
    super({ tag: 'input', classes: props.classes });
    const { type, id } = props;
    this.setAttribute('type', type);
    if (id) {
      this.setAttribute('id', id);
    }
  }

  setValue(value: string): void {
    this.node.value = value;
  }

  getValue(): string {
    return this.node.value;
  }

  clearValue(): void {
    this.node.value = '';
  }

  disable(): void {
    this.node.disabled = true;
  }

  enable(): void {
    this.node.disabled = false;
  }
}
