import BaseComponent from '../components/BaseComponent';

export default class ConnectPage extends BaseComponent {
  constructor() {
    super({ tag: 'section', classes: ['connection'] });
    const text = new BaseComponent({
      tag: 'p',
      text: 'Problem with server! Trying to reconnect...',
      classes: ['connection__text'],
    });
    const symbol = new BaseComponent({
      tag: 'span',
      classes: ['connection__symbol'],
    });
    const container = new BaseComponent(
      { classes: ['connection__container'] },
      text,
      symbol,
    );

    this.append(container);
  }
}
