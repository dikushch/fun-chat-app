import BaseComponent from '../components/BaseComponent';
import Button from '../components/Button';

export default class InfoPage extends BaseComponent {
  backBtn: Button;

  constructor() {
    super({ tag: 'section', classes: ['info'] });
    const title = new BaseComponent({
      tag: 'h2',
      text: 'Fun Chat',
      classes: ['info__title'],
    });
    const text = new BaseComponent({
      tag: 'p',
      text: 'It is an app for chatting with friends. The application was developed as part of the RSSchool JS/FE 2023Q4 course.',
      classes: ['info__text'],
    });
    const author = new BaseComponent({
      tag: 'a',
      text: 'author dikushch',
      classes: ['info__link'],
    });
    author.setAttribute('href', 'https://github.com/dikushch');
    author.setAttribute('target', '_blank');
    this.backBtn = new Button({ text: 'go back', classes: ['info__btn'] });

    const container = new BaseComponent(
      { classes: ['info__container'] },
      title,
      text,
      author,
      this.backBtn,
    );

    this.append(container);

    this.backBtn.addListener('click', () => {
      this.dispathCloseInfoEvent();
    });
  }

  dispathCloseInfoEvent(): void {
    const event = new CustomEvent('close-info', {
      bubbles: true,
    });
    this.getNode().dispatchEvent(event);
  }
}
