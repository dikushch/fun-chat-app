export default class BaseComponent<T extends HTMLElement = HTMLElement> {
  protected node: T;

  protected children: BaseComponent[] = [];

  constructor(
    {
      tag = 'div',
      text = '',
      classes = [],
    }: { tag?: string; text?: string; classes?: string[] },
    ...children: BaseComponent[]
  ) {
    const element: HTMLElement = document.createElement(tag);
    element.textContent = text;
    if (classes.length > 0) {
      element.classList.add(...classes);
    }
    this.node = element as T;

    if (children) {
      this.appendChildren(children);
    }
  }

  getNode(): HTMLElement {
    return this.node;
  }

  getChildren(): BaseComponent[] {
    return this.children;
  }

  append(child: BaseComponent): void {
    this.children.push(child);
    this.node.append(child.getNode());
  }

  appendChildren(children: BaseComponent[]): void {
    children.forEach((el) => {
      this.append(el);
    });
  }

  setTextContent(content: string): void {
    this.node.textContent = content;
  }

  setAttribute(attribute: string, value: string): void {
    this.node.setAttribute(attribute, value);
  }

  removeAttribute(attribute: string): void {
    this.node.removeAttribute(attribute);
  }

  addClass(className: string): void {
    this.node.classList.add(className);
  }

  removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  addListener(event: string, listener: (e: Event) => void): void {
    this.node.addEventListener(event, listener);
  }

  removeListener(event: string, listener: (e: Event) => void) {
    this.node.removeEventListener(event, listener);
  }

  destroyChildren(): void {
    this.children.forEach((child) => {
      child.destroy();
    });
    this.children.length = 0;
  }

  destroy(): void {
    this.destroyChildren();
    this.node.remove();
  }
}
