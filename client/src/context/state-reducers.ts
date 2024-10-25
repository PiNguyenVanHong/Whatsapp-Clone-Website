import { reducerCases } from "@/context/constants";
import { MessageType, UserContacts, UserType } from "@/utils/types";
import { format } from "date-fns";
import { Socket } from "socket.io-client";

interface BaseStateProps {
  userInfo?: UserType;
  newUser?: boolean;
  tokenData?: string;
  newMessage?: MessageType;
  messages?: Record<string, MessageType[]>;
  socket?: React.MutableRefObject<Socket | undefined>;
  userContacts?: UserContacts[];
  onlineUsers?: number[];
  filteredContacts?: UserContacts[];
  contactSearch?: string;
  videoCall?: UserType & {
    type?: "out-going" | "in-coming";
    callType?: "video";
    roomId?: number;
  };
  voiceCall?: UserType & {
    type?: "out-going" | "in-coming";
    callType?: "voice";
    roomId?: number;
  };
  incomingVoiceCall?: UserType & {
    type?: "out-going" | "in-coming";
    callType?: "voice";
    roomId?: number;
  };
  incomingVideoCall?: UserType & {
    type?: "out-going" | "in-coming";
    callType?: "video";
    roomId?: number;
  };
}

export interface StateReducerProps extends BaseStateProps {
  contactsPage?: boolean;
  currentChatUser?: UserType;
  messageSearch?: boolean;
}

export interface ActionProps extends BaseStateProps {
  type: string;
  fromSelf?: boolean;
  list?: MessageType[];
}

export const initialState: StateReducerProps = {
  userInfo: undefined,
  newUser: false,
  contactsPage: false,
  currentChatUser: undefined,
  newMessage: undefined,
  messages: undefined,
  messageSearch: false,
  socket: undefined,
  userContacts: [],
  onlineUsers: [],
  filteredContacts: [],
  contactSearch: "",
  videoCall: undefined,
  voiceCall: undefined,
  incomingVoiceCall: undefined,
  incomingVideoCall: undefined,
};

const reducer = (
  state: StateReducerProps,
  action: ActionProps
): StateReducerProps => {
  switch (action.type) {
    case reducerCases.SET_NEW_USER:
      return {
        ...state,
        newUser: action.newUser,
      };
    case reducerCases.SET_TOKEN_JWT:
      return {
        ...state,
        tokenData: action.tokenData,
      };
    case reducerCases.SET_ALL_CONTACTS_PAGE:
      return {
        ...state,
        contactsPage: !state.contactsPage,
      };
    case reducerCases.CHANGE_CURRENT_CHAT_USER:
      return {
        ...state,
        currentChatUser: action.userInfo,
      };
    case reducerCases.SET_MESSAGES: {
      if(!action.list) return { ...state };
      const groupedByDate = action.list.reduce((acc: any, message) => {
        const date = format(new Date(message.createdAt), "E P");
        
        if (!acc[date]) {
          acc[date] = [];
        }
        
        acc[date].push(message);
        
        return acc;
      }, {});

      return {
        ...state,
        messages: groupedByDate,
      };
    }
    case reducerCases.SET_SOCKET:
      return {
        ...state,
        socket: action.socket,
      };
    case reducerCases.SET_MESSAGE_SEARCH:
      return {
        ...state,
        messageSearch: !state.messageSearch,
      };
    case reducerCases.SET_USER_CONTACTS:
      return {
        ...state,
        userContacts: action.userContacts,
      };
    case reducerCases.SET_ONLINE_USERS:
      return {
        ...state,
        onlineUsers: action.onlineUsers,
      };
    case reducerCases.SET_VIDEO_CALL:
      return {
        ...state,
        videoCall: action.videoCall,
      };
    case reducerCases.SET_VOICE_CALL:
      return {
        ...state,
        voiceCall: action.voiceCall,
      };
    case reducerCases.SET_INCOMING_VIDEO_CALL:
      return {
        ...state,
        incomingVideoCall: action.incomingVideoCall,
      };
    case reducerCases.SET_INCOMING_VOICE_CALL:
      return {
        ...state,
        incomingVoiceCall: action.incomingVoiceCall,
      };
    case reducerCases.END_CALL:
      return {
        ...state,
        videoCall: undefined,
        voiceCall: undefined,
        incomingVideoCall: undefined,
        incomingVoiceCall: undefined,
      };
    case reducerCases.SET_EXIT_CHAT:
      return {
        ...state,
        currentChatUser: undefined,
      };
    case reducerCases.ADD_MESSAGES: {
      if (state.messages && action.newMessage) {
        const { createdAt } = action.newMessage;
        const date = format(new Date(createdAt), "E P");

        if (state.messages[date]) {
          return {
            ...state,
            messages: {
              ...state.messages,
              [date]: [...state.messages[date], action.newMessage],
            },
          };
        } else {
          return {
            ...state,
            messages: {
              ...state.messages,
              [date]: [action.newMessage],
            },
          };
        }
      }
      return state;
    }
    case reducerCases.SET_CONTACT_SEARCH: {
      const a = state.userContacts?.filter((contact) =>
        contact
          .first_name!.toLowerCase()
          .includes(action.contactSearch?.toLowerCase()!)
      );

      const b = state.userContacts?.filter((contact) =>
        contact
          .last_name!.toLowerCase()
          .includes(action.contactSearch?.toLowerCase()!)
      );

      const filteredContacts = [...a!, ...b!];
      return {
        ...state,
        contactSearch: action.contactSearch,
        filteredContacts,
      };
    }
    case reducerCases.SET_USER_INFO: {
      return {
        ...state,
        userInfo: action.userInfo,
      };
    }
    default:
      return state;
  }
};

export default reducer;
