import { LoginData } from '../types/Types';

export function startWS(
  bodyEl: HTMLElement,
  openHandler: (socket: WebSocket) => void,
  msgHandler: (e: MessageEvent) => void,
): WebSocket {
  const socket = new WebSocket('ws://localhost:4000');

  socket.onclose = () => {
    bodyEl.classList.remove('open');
    bodyEl.classList.add('close');
    startWS(bodyEl, openHandler, msgHandler);
  };

  socket.onopen = () => {
    openHandler(socket);
    bodyEl.classList.add('open');
    bodyEl.classList.remove('close');
  };

  socket.onmessage = (e) => {
    msgHandler(e);
  };

  return socket;
}

export function sendLogin(
  socket: WebSocket,
  { login, password }: LoginData,
): void {
  const data = {
    id: null,
    type: 'USER_LOGIN',
    payload: {
      user: {
        login,
        password,
      },
    },
  };
  socket.send(JSON.stringify(data));
}

export function sendLogout(
  socket: WebSocket,
  { login, password }: LoginData,
): void {
  const data = {
    id: null,
    type: 'USER_LOGOUT',
    payload: {
      user: {
        login,
        password,
      },
    },
  };
  socket.send(JSON.stringify(data));
}

export function getActiveUsers(socket: WebSocket): void {
  const data = {
    id: null,
    type: 'USER_ACTIVE',
    payload: null,
  };
  socket.send(JSON.stringify(data));
}

export function getInactiveUsers(socket: WebSocket): void {
  const data = {
    id: null,
    type: 'USER_INACTIVE',
    payload: null,
  };
  socket.send(JSON.stringify(data));
}

export function sendMsg(
  socket: WebSocket,
  { to, text }: { to: string; text: string },
): void {
  const data = {
    id: null,
    type: 'MSG_SEND',
    payload: {
      message: {
        to,
        text,
      },
    },
  };
  socket.send(JSON.stringify(data));
}

export function getHistory(
  socket: WebSocket,
  user: string,
  contact: string,
): void {
  const data = {
    id: user.concat(contact),
    type: 'MSG_FROM_USER',
    payload: {
      user: {
        login: contact,
      },
    },
  };
  socket.send(JSON.stringify(data));
}

export function changeReadStatus(socket: WebSocket, id: string): void {
  const data = {
    id: null,
    type: 'MSG_READ',
    payload: {
      message: {
        id,
      },
    },
  };
  socket.send(JSON.stringify(data));
}

export function deleteMsg(socket: WebSocket, id: string): void {
  const data = {
    id: null,
    type: 'MSG_DELETE',
    payload: {
      message: {
        id,
      },
    },
  };
  socket.send(JSON.stringify(data));
}

export function editMsg(socket: WebSocket, id: string, text: string): void {
  const data = {
    id: null,
    type: 'MSG_EDIT',
    payload: {
      message: {
        id,
        text,
      },
    },
  };
  socket.send(JSON.stringify(data));
}
