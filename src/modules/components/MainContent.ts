import BaseComponent from './BaseComponent';
import ChatBox from './ChatBox';
import UsersList from './UsersList';

export default class MainContent extends BaseComponent {
  users: UsersList;

  chat: ChatBox;

  contactName: string | null = null;

  constructor(userName: string) {
    super({ tag: 'section', classes: ['content'] });
    this.users = new UsersList(userName);
    this.chat = new ChatBox(userName);

    this.append(this.users);
    this.append(this.chat);

    this.users.addListener('click', (e) => {
      this.setActiveContact(e);
    });
  }

  enableForm(): void {
    if (this.contactName) {
      this.chat.isMsgEdit = false;
      this.chat.sendForm.input.clearValue();
      this.chat.sendForm.enable();
    }
  }

  setActiveContact(e: Event): void {
    const user: HTMLElement | null = (e.target as HTMLElement).closest(
      '.users__item',
    );
    if (user) {
      this.contactName = user.textContent;
      this.chat.setContactName(this.contactName as string);
      this.users.setContact(user);
      const status = (user.parentElement as HTMLElement).classList.contains(
        'users__active',
      )
        ? 'online'
        : 'offline';
      this.chat.contactInfo.setInfo(this.contactName as string, status);
      this.chat.msgBox.createHistoryList(this.contactName as string);
      this.enableForm();
    }
  }
}
