import BaseComponent from './BaseComponent';

export default class MainFooter extends BaseComponent {
  constructor() {
    super({ tag: 'footer', classes: ['footer'] });
    const logo = new BaseComponent({ classes: ['footer__logo'] });
    const link = new BaseComponent({
      tag: 'a',
      text: 'dikushch',
      classes: ['footer__link'],
    });
    link.setAttribute('href', 'https://github.com/dikushch');
    link.setAttribute('target', '_blank');
    const year = new BaseComponent({
      tag: 'p',
      text: '2024',
      classes: ['footer__year'],
    });

    this.append(logo);
    this.append(link);
    this.append(year);
  }
}
