import { LoginData } from '../types/Types';
import BaseComponent from './BaseComponent';
import Button from './Button';

export default class MainHeader extends BaseComponent {
  user: BaseComponent;

  logoutBtn: Button;

  userData: LoginData;

  constructor(userData: LoginData) {
    super({ tag: 'header', classes: ['header'] });
    this.userData = userData;
    this.user = new BaseComponent({
      tag: 'h3',
      text: `user: ${this.userData.login}`,
      classes: ['header__user'],
    });
    const title = new BaseComponent({
      tag: 'h2',
      text: 'Fun Chat',
      classes: ['header__title'],
    });
    this.logoutBtn = new Button({ text: 'log out', classes: ['header__btn'] });

    this.append(this.user);
    this.append(title);
    this.append(this.logoutBtn);

    this.logoutBtn.addListener('click', () => {
      this.dispathLogoutEvent();
    });
  }

  dispathLogoutEvent(): void {
    const event = new CustomEvent('logout', {
      bubbles: true,
      detail: this.userData,
    });
    this.getNode().dispatchEvent(event);
  }
}
