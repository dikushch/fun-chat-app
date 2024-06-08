import { UserLog } from '../types/Types';
import BaseComponent from './BaseComponent';
import Input from './Input';

export default class UsersList extends BaseComponent {
  search: Input;

  list: BaseComponent;

  activeUsers: BaseComponent[] | null = null;

  inactiveUsers: BaseComponent[] | null = null;

  activeList: BaseComponent;

  inactiveList: BaseComponent;

  currentUserName: string;

  constructor(userName: string) {
    super({ classes: ['users'] });
    this.currentUserName = userName;
    this.search = new Input({ type: 'text', classes: ['users__search'] });
    this.search.setAttribute('placeholder', 'Find...');
    this.activeList = new BaseComponent({
      tag: 'ul',
      classes: ['users__active'],
    });
    this.inactiveList = new BaseComponent({
      tag: 'ul',
      classes: ['users__inactive'],
    });
    this.list = new BaseComponent(
      { classes: ['users__lists'] },
      this.activeList,
      this.inactiveList,
    );

    this.append(this.search);
    this.append(this.list);

    this.search.addListener('input', () => {
      this.findUsers(this.search.getValue().toLowerCase());
    });
  }

  createList(active: true | false, users: UserLog[]) {
    const list = users
      .filter(({ login }) => login !== this.currentUserName)
      .map(({ login }) => {
        const li = new BaseComponent({
          tag: 'li',
          text: `${login}`,
          classes: ['users__item'],
        });
        li.setAttribute('data-um', '0');
        return li;
      });
    if (active) {
      this.activeUsers = list;
      UsersList.renderList(this.activeList, list);
    } else {
      this.inactiveUsers = list;
      UsersList.renderList(this.inactiveList, list);
    }
  }

  static renderList(list: BaseComponent, users: BaseComponent[]): void {
    list.destroyChildren();
    list.appendChildren(users);
  }

  findUsers(value: string) {
    if (!value) {
      UsersList.renderList(
        this.activeList,
        this.activeUsers as BaseComponent[],
      );
      UsersList.renderList(
        this.inactiveList,
        this.inactiveUsers as BaseComponent[],
      );
    } else {
      UsersList.renderList(
        this.activeList,
        (this.activeUsers as BaseComponent[]).filter((e) =>
          e.getNode().textContent?.toLowerCase().includes(value),
        ),
      );
      UsersList.renderList(
        this.inactiveList,
        (this.inactiveUsers as BaseComponent[]).filter((e) =>
          e.getNode().textContent?.toLowerCase().includes(value),
        ),
      );
    }
  }

  setContact(node: HTMLElement): void {
    this.activeUsers?.forEach((e) => {
      e.removeClass('active');
    });
    this.inactiveUsers?.forEach((e) => {
      e.removeClass('active');
    });
    node.classList.add('active');
  }

  static findUser(name: string, users: BaseComponent[]): number | null {
    const result = users.findIndex((e) => e.getNode().textContent === name);
    if (result !== -1) {
      return result;
    }
    return null;
  }

  addExternalLoginUser(name: string): void {
    const index = UsersList.findUser(
      name,
      this.inactiveUsers as BaseComponent[],
    );
    if (index !== null) {
      const user = this.inactiveUsers?.splice(index, 1);
      if (user) {
        this.activeUsers?.push(user[0]);
        this.activeList.append(user[0]);
      }
    } else {
      const newUser = new BaseComponent({
        tag: 'li',
        text: name,
        classes: ['users__item'],
      });
      this.activeUsers?.push(newUser);
      this.activeList.append(newUser);
    }
  }

  addExternalLogoutUser(name: string): void {
    const index = UsersList.findUser(name, this.activeUsers as BaseComponent[]);
    if (index !== null) {
      const user = this.activeUsers?.splice(index, 1);
      if (user) {
        this.inactiveUsers?.push(user[0]);
        this.inactiveList.append(user[0]);
      }
    }
  }

  addUnreadMsgs(contact: string, count: number): void {
    let index = UsersList.findUser(
      contact,
      this.activeUsers as BaseComponent[],
    );
    if (index !== null && this.activeUsers) {
      UsersList.setUnreadParams(this.activeUsers, index, count);
    } else {
      index = UsersList.findUser(
        contact,
        this.inactiveUsers as BaseComponent[],
      );
      if (index !== null && this.inactiveUsers) {
        UsersList.setUnreadParams(this.inactiveUsers, index, count);
      }
    }
  }

  static setUnreadParams(
    list: BaseComponent[],
    index: number,
    count: number,
  ): void {
    if (count) {
      list[index].addClass('unread');
    } else {
      list[index].removeClass('unread');
    }
    list[index].setAttribute('data-um', `${count}`);
  }
}
