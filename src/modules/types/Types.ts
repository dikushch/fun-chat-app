export interface LoginData {
  login: string;
  password: string;
}

export interface UserLog {
  login: string;
  isLogined: boolean;
}

export interface LogInOutResponce {
  id: string | null;
  type: string;
  payload: {
    user: UserLog;
  };
}

export interface AllUsersResponce {
  id: string | null;
  type: string;
  payload: {
    users: UserLog[];
  };
}

export interface ErrRespoce {
  id: string;
  type: string;
  payload: {
    error: string;
  };
}

export interface SendMsgResponce {
  id: string;
  type: string;
  payload: {
    message: MsgData;
  };
}

export interface MsgFromUser {
  id: string;
  type: string;
  payload: {
    messages: MsgData[] | [];
  };
}

export interface MsgData {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MsgStatus;
}

export interface MsgStatus {
  isDelivered: boolean;
  isReaded: boolean;
  isEdited: boolean;
}

export interface MsgDelivedResponce {
  id: null;
  type: string;
  payload: {
    message: {
      id: string;
      status: {
        isDelivered: boolean;
      };
    };
  };
}

export interface MsgReadResponce {
  id: string;
  type: string;
  payload: {
    message: {
      id: string;
      status: {
        isReaded: boolean;
      };
    };
  };
}

export interface MsgDelResponce {
  id: string | null;
  type: string;
  payload: {
    message: {
      id: string;
      status: {
        isDeleted: boolean;
      };
    };
  };
}

export interface MsgEditResponce {
  id: string | null;
  type: string;
  payload: {
    message: {
      id: string;
      text: string;
      status: {
        isEdited: boolean;
      };
    };
  };
}
