import BaseComponent from '../components/BaseComponent';
import MainContent from '../components/MainContent';
import MainFooter from '../components/MainFooter';
import MainHeader from '../components/MainHeader';
import { LoginData } from '../types/Types';

export default class MainPage extends BaseComponent {
  header: MainHeader;

  footer: MainFooter;

  content: MainContent;

  constructor(userData: LoginData) {
    super({ tag: 'main', classes: ['main'] });
    this.header = new MainHeader(userData);
    this.footer = new MainFooter();
    this.content = new MainContent(userData.login);

    this.append(this.header);
    this.append(this.content);
    this.append(this.footer);
  }
}
