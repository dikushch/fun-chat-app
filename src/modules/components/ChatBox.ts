import BaseComponent from './BaseComponent';
import ContactInfo from './ContactInfo';
import MsgBox from './MsgBox';
import MsgContextmenu from './MsgContextmenu';
import SendForm from './SendForm';

export default class ChatBox extends BaseComponent {
  sendForm: SendForm;

  contactInfo: ContactInfo;

  msgBox: MsgBox;

  contactName: string | null = null;

  isMsgEdit: boolean = false;

  editMsgId: string = '';

  constructor(userName: string) {
    super({ classes: ['chat'] });
    this.sendForm = new SendForm();
    this.contactInfo = new ContactInfo();
    this.msgBox = new MsgBox(userName);

    this.append(this.contactInfo);
    this.append(this.msgBox);
    this.append(this.sendForm);

    this.sendForm.addListener('submit', (e) => {
      e.preventDefault();
      if (!this.isMsgEdit) {
        const unreadMsgs = this.msgBox.getUnreadMsgs(
          this.contactName as string,
        );
        if (unreadMsgs.length) {
          this.msgBox.removeDivider();
          this.dispatchReadMsgEvent(unreadMsgs);
        }
        this.dispatchSendMsgEvent(
          this.contactName as string,
          this.sendForm.getMsg(),
        );
      } else {
        this.dispatchEditMsgEvent(this.editMsgId, this.sendForm.getMsg());
        this.isMsgEdit = false;
      }
      this.sendForm.resetForm();
    });

    this.msgBox.addListener('scroll', () => {
      if (!this.msgBox.disableScroll) {
        const unreadMsgs = this.msgBox.getUnreadMsgs(
          this.contactName as string,
        );
        if (unreadMsgs.length) {
          this.msgBox.removeDivider();
          this.dispatchReadMsgEvent(unreadMsgs);
        }
      }
    });

    this.msgBox.addListener('scrollend', () => {
      if (this.msgBox.disableScroll) {
        this.msgBox.disableScroll = false;
      }
    });

    this.msgBox.addListener('click', () => {
      const unreadMsgs = this.msgBox.getUnreadMsgs(this.contactName as string);
      if (unreadMsgs.length) {
        this.msgBox.removeDivider();
        this.dispatchReadMsgEvent(unreadMsgs);
      }
    });

    this.msgBox.addListener('contextmenu', (e) => {
      ChatBox.contextmenuHandler(e);
    });
  }

  setContactName(name: string): void {
    this.contactName = name;
  }

  dispatchSendMsgEvent(to: string, text: string): void {
    const event = new CustomEvent('send-msg', {
      bubbles: true,
      detail: { to, text },
    });
    this.getNode().dispatchEvent(event);
  }

  dispatchReadMsgEvent(msgs: string[]): void {
    const event = new CustomEvent('read-msg', {
      bubbles: true,
      detail: msgs,
    });
    this.getNode().dispatchEvent(event);
  }

  static contextmenuHandler(e: Event): void {
    e.preventDefault();
    const x = (e as MouseEvent).pageX;
    const y = (e as MouseEvent).pageY;
    const msg = (e.target as HTMLElement).closest('.msg');
    if (msg && msg.classList.contains('my')) {
      const { id } = (msg as HTMLElement).dataset;
      const text = msg.children[1].textContent;
      const cMenu = new MsgContextmenu(id as string, text as string, x, y);
      cMenu.open();
    }
  }

  dispatchEditMsgEvent(id: string, text: string): void {
    const event = new CustomEvent('edit-msg', {
      bubbles: true,
      detail: { id, text },
    });
    this.getNode().dispatchEvent(event);
  }

  changeMsg(id: string, text: string): void {
    this.isMsgEdit = true;
    this.sendForm.input.setValue(text);
    this.sendForm.enable();
    this.editMsgId = id;
  }
}
