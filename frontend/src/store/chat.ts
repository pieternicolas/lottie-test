import { atomWithQuery } from 'jotai-tanstack-query';

import { axiosClient } from '~/utils/axios';

import { currentUserAtom } from './auth';

export const getAllChatsAtom = atomWithQuery((get) => ({
  queryKey: ['getProjectJson'],
  queryFn: async () => {
    const res = await axiosClient({
      method: 'get',
      url: '/chats',
      headers: {
        Authorization: get(currentUserAtom)?.id,
      },
    });
    return res.data;
  },
}));
