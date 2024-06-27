import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import { atomWithReset } from 'jotai/utils';
import { z } from 'zod';

import { axiosClient } from '~/utils/axios';

import { currentUserAtom } from './auth';

export const chatMessageSchema = z.object({
  message: z.string().trim().min(1, {
    message: 'Message is required',
  }),
});
export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;

export type ChatMessage = {
  message: string;
  time: string;
  user: string;
  to: string;
};

export type Chat = {
  _id: string;
  messages: ChatMessage[];
  members: string[];
  updatedAt: string;
};

export type ChatRoom = {
  receiverId: string;
  receiverName: string;
  messages: ChatMessage[];
};

export const getAllChatsAtom = atomWithQuery((get) => ({
  queryKey: ['getProjectJson'],
  queryFn: async () => {
    const res = await axiosClient<{ data: Chat[] }>({
      method: 'get',
      url: '/chats',
      headers: {
        Authorization: get(currentUserAtom)?.id,
      },
    });
    return res.data;
  },
}));

// export const connectedToChatServerAtom = atomWithStorage(
//   'connectedToChatServer',
//   false,
//   undefined,
//   {
//     getOnInit: true,
//   }
// );
export const connectedToChatServerAtom = atomWithReset(false);
export const activeChatAtom = atomWithReset<string | null>(null);
export const activeChatRoomsAtom = atomWithReset<Map<string, ChatRoom>>(
  new Map()
);

type ChatRoomActions =
  | { type: 'newMessage'; payload: ChatMessage }
  | { type: 'openChat'; payload: any }
  | {
      type: 'reset';
    };

const reducer = (
  state: Map<string, ChatRoom>,
  action: ChatRoomActions
): Map<string, ChatRoom> => {
  switch (action.type) {
    case 'newMessage': {
      const baseState = new Map(state);

      const toRoom = baseState.get(action.payload.to);
      const fromRoom = baseState.get(action.payload.user);
      const chatRoom = toRoom || fromRoom;

      if (chatRoom) {
        chatRoom.messages.push({
          message: action.payload.message,
          time: action.payload.time,
          user: action.payload.user,
          to: action.payload.to,
        });

        const newState = baseState.set(
          toRoom ? action.payload.to : action.payload.user,
          chatRoom
        );

        return newState;
      }

      return state;
    }

    case 'openChat': {
      const baseState = new Map(state);
      baseState.set(action.payload.receiverId, action.payload);

      return baseState;
    }

    case 'reset':
      return new Map();

    default:
      return state;
  }
};

export const chatRoomAtom = atom(
  (get) => get(activeChatRoomsAtom),
  (get, set, action: ChatRoomActions) => {
    set(activeChatRoomsAtom, reducer(get(activeChatRoomsAtom), action));
  }
);
