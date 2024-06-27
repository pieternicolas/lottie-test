import { atomWithQuery } from 'jotai-tanstack-query';
import { atomWithReset, atomWithStorage } from 'jotai/utils';

import { axiosClient } from '~/utils/axios';

import { currentUserAtom } from './auth';

export type ChatMessage = {
  message: string;
  time: string;
  user: string;
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

export const activeChatAtom = atomWithReset<string | null>(null);
export const activeChatRoomsAtom = atomWithStorage<ChatRoom[]>(
  'activeChatRooms',
  [],
  undefined,
  {
    getOnInit: true,
  }
);
