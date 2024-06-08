import { MsgData } from '../types/Types';
import BaseComponent from './BaseComponent';
import Msg from './Msg';

export default class MsgBox extends BaseComponent {
  history: Map<string, MsgData[]> = new Map();

  currentUser: string;

  currentList: BaseComponent | null = null;

  isUnreadInList: boolean = false;

  divider: BaseComponent;

  disableScroll = false;

  constructor(userName: string) {
    super({ classes: ['msg-box'] });
    this.currentUser = userName;
    this.divider = new BaseComponent({
      tag: 'li',
      text: 'new messages',
      classes: ['msg-divider'],
    });
  }

  addUserHistory(user: string, history: MsgData[] | []): void {
    this.history.set(user, history);
  }

  createHistoryList(user: string) {
    const list = new BaseComponent({
      tag: 'ul',
      classes: ['msg-list'],
    });
    const msgs = this.history.get(user);
    let isUnread = false;
    this.divider = new BaseComponent({
      tag: 'li',
      text: 'new messages',
      classes: ['msg-divider'],
    });
    if (msgs) {
      const msgNodes: BaseComponent[] = [];
      msgs.forEach((msg) => {
        if (
          !isUnread &&
          msg.from !== this.currentUser &&
          !msg.status.isReaded
        ) {
          isUnread = true;
          msgNodes.push(this.divider);
        }
        msgNodes.push(new Msg(msg, this.currentUser));
      });
      list.appendChildren(msgNodes);
    }
    if (this.getChildren().length) {
      this.destroyChildren();
    }
    this.append(list);
    this.currentList = list;
    this.disableScroll = true;
    if (isUnread) {
      this.isUnreadInList = true;
      this.divider.getNode().scrollIntoView({ behavior: 'auto' });
    } else {
      this.getNode().scrollTo(0, this.getNode().scrollHeight);
    }
  }

  addMsgToHistory(msg: MsgData): void {
    let contact;
    if (msg.from === this.currentUser) {
      contact = msg.to;
    } else {
      contact = msg.from;
    }
    const chat = this.history.get(contact);
    if (chat) {
      chat.push(msg);
    } else {
      this.history.set(contact, [msg]);
    }
  }

  appendMsg(data: MsgData): void {
    const msg = new Msg(data, this.currentUser);
    this.currentList?.append(msg);

    if (msg.getNode().classList.contains('my')) {
      msg.getNode().scrollIntoView({ behavior: 'smooth' });
    } else if (!data.status.isReaded && !this.isUnreadInList) {
      this.isUnreadInList = true;
      this.disableScroll = true;
      this.divider = new BaseComponent({
        tag: 'li',
        text: 'new messages',
        classes: ['msg-divider'],
      });
      msg.getNode().before(this.divider.getNode());
      this.divider.getNode().scrollIntoView({ behavior: 'smooth' });
    } else {
      this.disableScroll = true;
      this.divider.getNode().scrollIntoView({ behavior: 'smooth' });
    }
  }

  findMsgInHistory(id: string): { msg: MsgData; contact: string } | null {
    const historyIterator = this.history.entries();
    const { size } = this.history;
    for (let i = 0; i < size; i += 1) {
      const [contact, history] = historyIterator.next().value;
      const msg = history.find((m: MsgData) => m.id === id);
      if (msg) {
        return { msg, contact };
      }
    }
    return null;
  }

  changeDelivedStatus(id: string): string {
    const msg = this.findMsgInHistory(id);
    if (msg) {
      (msg.msg as MsgData).status.isDelivered = true;
      return msg.contact;
    }
    return '';
  }

  changeReadStatus(id: string): string {
    const msg = this.findMsgInHistory(id);
    if (msg) {
      (msg.msg as MsgData).status.isReaded = true;
      return msg.contact;
    }
    return '';
  }

  changeMsgStatus(id: string, status: string) {
    const messages = this.currentList?.getChildren();
    if (messages) {
      const msg = messages.find((e) => (e as Msg).id === id);
      if (msg) {
        (msg as Msg).status.setTextContent(status);
      }
    }
  }

  getUnreadMsgs(contact: string): string[] {
    let unreadMsgs: string[] = [];
    const msgs = this.history.get(contact);
    if (msgs?.length) {
      unreadMsgs = msgs
        .filter(
          (data) => !data.status.isReaded && data.from !== this.currentUser,
        )
        .map((m) => m.id);
    }
    return unreadMsgs;
  }

  removeDivider() {
    this.isUnreadInList = false;
    this.divider.getNode().remove();
  }

  deleteMsg(id: string): { from: string; to: string } | null {
    const msg = this.findMsgInHistory(id);
    if (msg) {
      const history = this.history.get(msg.contact);
      const msgIndex = history?.findIndex((m) => m.id === id);
      if (msgIndex) {
        const delMsg = history?.splice(msgIndex, 1);
        if (delMsg) {
          return { from: delMsg[0].from, to: delMsg[0].to };
        }
      }
    }
    return null;
  }

  deleteMsgNode(id: string): void {
    const msg = this.currentList
      ?.getChildren()
      .find((m) => (m as Msg).id === id);
    if (msg) {
      msg.destroy();
    }
  }

  changeMsg(id: string, text: string): void {
    const msg = this.findMsgInHistory(id);
    if (msg) {
      msg.msg.text = text;
      msg.msg.status.isEdited = true;
    }
  }

  changeMsgNode(id: string, text: string): void {
    const msg = this.currentList
      ?.getChildren()
      .find((m) => (m as Msg).id === id);
    if (msg) {
      (msg as Msg).text.setTextContent(text);
    }
  }

  changeEditStatus(id: string): void {
    const msg = this.findMsgInHistory(id);
    if (msg) {
      msg.msg.status.isEdited = true;
    }
    const msgNodes = this.currentList?.getChildren();
    if (msgNodes) {
      const m = msgNodes.find((e) => (e as Msg).id === id);
      if (m) {
        (m as Msg).edit.setTextContent('edited');
      }
    }
  }
}
