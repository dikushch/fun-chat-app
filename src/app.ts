import './styles.scss';
import {
  changeReadStatus,
  deleteMsg,
  editMsg,
  getActiveUsers,
  getHistory,
  getInactiveUsers,
  sendLogin,
  sendLogout,
  sendMsg,
  startWS,
} from './modules/api/Api';
import AuthPage from './modules/pages/AuthPage';
import MainPage from './modules/pages/MainPage';
import InfoPage from './modules/pages/InfoPage';
import {
  AllUsersResponce,
  ErrRespoce,
  LogInOutResponce,
  LoginData,
  MsgDelResponce,
  MsgDelivedResponce,
  MsgEditResponce,
  MsgFromUser,
  MsgReadResponce,
  SendMsgResponce,
  UserLog,
} from './modules/types/Types';
import ConnectPage from './modules/pages/ConnectPage';
import ErrMsg from './modules/components/ErrMsg';

class App {
  element: HTMLElement = document.body;

  socket: WebSocket;

  authPage: AuthPage;

  connectPage: ConnectPage;

  mainPage: MainPage | null = null;

  infoPage: InfoPage;

  isLogined: boolean = false;

  currentUser: LoginData | null = null;

  activeUsers: UserLog[] | null = null;

  inactiveUsers: UserLog[] | null = null;

  constructor() {
    this.element.classList.add('close');
    this.socket = startWS(
      this.element,
      this.onOpenHandler.bind(this),
      this.onMessageHandler.bind(this),
    );
    this.connectPage = new ConnectPage();
    this.authPage = new AuthPage();
    this.infoPage = new InfoPage();
    this.element.append(this.connectPage.getNode());
  }

  render() {
    if (this.checkStorage()) {
      sendLogin(this.socket, this.currentUser as LoginData);
    } else {
      this.element.append(this.authPage.getNode());
    }
  }

  checkStorage(): boolean {
    const data = sessionStorage.getItem('user');
    if (data) {
      this.currentUser = JSON.parse(data);
      return true;
    }
    return false;
  }

  saveUser(): void {
    sessionStorage.setItem('user', JSON.stringify(this.currentUser));
  }

  renderMain(): void {
    this.authPage.getNode().remove();
    if (this.mainPage) {
      this.mainPage.destroy();
    }
    this.mainPage = new MainPage(this.currentUser as LoginData);
    this.element.append(this.mainPage.getNode());
  }

  renderAuth(): void {
    if (this.mainPage) {
      this.mainPage.destroy();
      this.mainPage = null;
    }
    this.element.append(this.authPage.getNode());
  }

  loginHandler(e: CustomEvent): void {
    const data = e.detail;
    if (this.socket) {
      this.currentUser = data;
      sendLogin(this.socket, data);
      getActiveUsers(this.socket);
      getInactiveUsers(this.socket);
    }
  }

  logoutHandler(e: CustomEvent): void {
    const data = e.detail;
    if (this.socket) {
      this.currentUser = null;
      sendLogout(this.socket, data);
    }
  }

  infoOpenHandler(): void {
    this.authPage.getNode().remove();
    this.element.append(this.infoPage.getNode());
  }

  infoCloseHandler(): void {
    this.infoPage.getNode().remove();
    this.element.append(this.authPage.getNode());
  }

  loginResponce(data: LogInOutResponce) {
    this.isLogined = data.payload.user.isLogined;
    if (this.isLogined) {
      this.saveUser();
      this.renderMain();
      getActiveUsers(this.socket);
      getInactiveUsers(this.socket);
    } else {
      this.renderAuth();
    }
  }

  logoutResponce(data: LogInOutResponce) {
    this.isLogined = data.payload.user.isLogined;
    sessionStorage.clear();
    this.renderAuth();
  }

  activeUsersResponce(data: AllUsersResponce) {
    this.activeUsers = data.payload.users;
    if (this.mainPage) {
      this.mainPage.content.users.createList(true, this.activeUsers);
      this.activeUsers.forEach((user) => {
        if (user.login !== this.currentUser?.login) {
          getHistory(
            this.socket,
            this.currentUser?.login as string,
            user.login,
          );
        }
      });
    }
  }

  inactiveUsersResponce(data: AllUsersResponce) {
    this.inactiveUsers = data.payload.users;
    if (this.mainPage) {
      this.mainPage.content.users.createList(false, this.inactiveUsers);
      this.inactiveUsers.forEach((user) => {
        getHistory(this.socket, this.currentUser?.login as string, user.login);
      });
    }
  }

  errorResponce(data: ErrRespoce) {
    const errMsg = new ErrMsg(data.payload.error);
    this.element.append(errMsg.getNode());
  }

  externalLoginResponce(data: LogInOutResponce): void {
    const name = data.payload.user.login;
    this.mainPage?.content.users.addExternalLoginUser(name);
    if (name === this.mainPage?.content.contactName) {
      this.mainPage.content.chat.contactInfo.setInfo(name, 'online');
    }
  }

  externalLogoutResponce(data: LogInOutResponce): void {
    const name = data.payload.user.login;
    this.mainPage?.content.users.addExternalLogoutUser(data.payload.user.login);
    if (name === this.mainPage?.content.contactName) {
      this.mainPage.content.chat.contactInfo.setInfo(name, 'offline');
    }
  }

  msgSendResponce(data: SendMsgResponce) {
    const user = this.currentUser?.login;
    const msg = data.payload.message;
    if (msg.from === user || msg.to === user) {
      this.mainPage?.content.chat.msgBox.addMsgToHistory(data.payload.message);
      const currentContact = this.mainPage?.content.contactName;
      if (currentContact === msg.from || currentContact === msg.to) {
        this.mainPage?.content.chat.msgBox.appendMsg(data.payload.message);
      }
      const contact = msg.from === user ? msg.to : msg.from;
      const unreadCount =
        this.mainPage?.content.chat.msgBox.getUnreadMsgs(contact).length;
      if (unreadCount) {
        this.mainPage?.content.users.addUnreadMsgs(contact, unreadCount);
      }
    }
  }

  msgFromUserResponce(data: MsgFromUser) {
    const userName = data.id.slice(0, this.currentUser?.login.length);
    if (userName === this.currentUser?.login) {
      const contact = data.id.slice(this.currentUser.login.length);
      this.mainPage?.content.chat.msgBox.addUserHistory(
        contact,
        data.payload.messages,
      );
      const unreadCount =
        this.mainPage?.content.chat.msgBox.getUnreadMsgs(contact).length;
      if (unreadCount) {
        this.mainPage?.content.users.addUnreadMsgs(contact, unreadCount);
      }
    }
  }

  msgDelivedResponce(data: MsgDelivedResponce) {
    const { id } = data.payload.message;
    const contact = this.mainPage?.content.chat.msgBox.changeDelivedStatus(id);
    if (contact === this.mainPage?.content.chat.contactName) {
      this.mainPage?.content.chat.msgBox.changeMsgStatus(id, 'delived');
    }
  }

  msgReadResponce(data: MsgReadResponce) {
    const { id } = data.payload.message;
    const contact = this.mainPage?.content.chat.msgBox.changeReadStatus(id);
    if (contact === this.mainPage?.content.chat.contactName) {
      this.mainPage?.content.chat.msgBox.changeMsgStatus(id, 'read');
    }
  }

  msgDeleteResponce(data: MsgDelResponce) {
    const { id } = data.payload.message;
    const fromTo = this.mainPage?.content.chat.msgBox.deleteMsg(id);
    this.mainPage?.content.chat.msgBox.deleteMsgNode(id);
    let contact;
    if (fromTo) {
      const { from, to } = fromTo;
      contact = from === this.currentUser?.login ? to : from;
    }
    if (contact) {
      const unreadCount =
        this.mainPage?.content.chat.msgBox.getUnreadMsgs(contact).length;
      if (unreadCount !== undefined) {
        this.mainPage?.content.users.addUnreadMsgs(contact, unreadCount);
        if (
          unreadCount === 0 &&
          contact === this.mainPage?.content.contactName
        ) {
          this.mainPage.content.chat.msgBox.removeDivider();
        }
      }
    }
  }

  msgEditResponce(data: MsgEditResponce) {
    const { id, text } = data.payload.message;
    this.mainPage?.content.chat.msgBox.changeMsg(id, text);
    this.mainPage?.content.chat.msgBox.changeMsgNode(id, text);
    this.mainPage?.content.chat.msgBox.changeEditStatus(id);
  }

  onMessageHandler(e: MessageEvent) {
    const data = JSON.parse(e.data);

    switch (data.type) {
      case 'USER_LOGIN':
        this.loginResponce(data);
        break;

      case 'USER_LOGOUT':
        this.logoutResponce(data);
        break;

      case 'USER_ACTIVE':
        this.activeUsersResponce(data);
        break;

      case 'USER_INACTIVE':
        this.inactiveUsersResponce(data);
        break;

      case 'ERROR':
        this.errorResponce(data);
        break;

      case 'USER_EXTERNAL_LOGIN':
        this.externalLoginResponce(data);
        break;

      case 'USER_EXTERNAL_LOGOUT':
        this.externalLogoutResponce(data);
        break;

      case 'MSG_SEND':
        this.msgSendResponce(data);
        break;

      case 'MSG_FROM_USER':
        this.msgFromUserResponce(data);
        break;

      case 'MSG_DELIVER':
        this.msgDelivedResponce(data);
        break;

      case 'MSG_READ':
        this.msgReadResponce(data);
        break;

      case 'MSG_DELETE':
        this.msgDeleteResponce(data);
        break;

      case 'MSG_EDIT':
        this.msgEditResponce(data);
        break;

      default:
        break;
    }
  }

  onOpenHandler(socket: WebSocket): void {
    this.setSocket(socket);
    this.render();
  }

  setSocket(socket: WebSocket): void {
    this.socket = socket;
  }

  sendMsgHandler(e: CustomEvent): void {
    sendMsg(this.socket, e.detail);
  }

  readMsgHandler(e: CustomEvent): void {
    const unreadMsgs = e.detail;
    unreadMsgs.forEach((id: string) => {
      changeReadStatus(this.socket, id);
    });
    this.mainPage?.content.users.addUnreadMsgs(
      this.mainPage.content.contactName as string,
      0,
    );
  }

  deleteMsgHandler(e: CustomEvent): void {
    deleteMsg(this.socket, e.detail);
  }

  changeMsgHandler(e: CustomEvent): void {
    const { id, text } = e.detail;
    this.mainPage?.content.chat.changeMsg(id, text);
  }

  editMsgHandler(e: CustomEvent): void {
    const { id, text } = e.detail;
    editMsg(this.socket, id, text);
  }

  addListeners() {
    this.element.addEventListener('login', (e) => {
      this.loginHandler(e as CustomEvent);
    });
    this.element.addEventListener('logout', (e) => {
      this.logoutHandler(e as CustomEvent);
    });
    this.element.addEventListener('info', () => {
      this.infoOpenHandler();
    });
    this.element.addEventListener('close-info', () => {
      this.infoCloseHandler();
    });
    this.element.addEventListener('send-msg', (e) => {
      this.sendMsgHandler(e as CustomEvent);
    });
    this.element.addEventListener('read-msg', (e) => {
      this.readMsgHandler(e as CustomEvent);
    });
    this.element.addEventListener('delete-msg', (e) => {
      this.deleteMsgHandler(e as CustomEvent);
    });
    this.element.addEventListener('change-msg', (e) => {
      this.changeMsgHandler(e as CustomEvent);
    });
    this.element.addEventListener('edit-msg', (e) => {
      this.editMsgHandler(e as CustomEvent);
    });
  }
}

const app = new App();
app.addListeners();
