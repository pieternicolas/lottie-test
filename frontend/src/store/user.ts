import { atomWithQuery } from 'jotai-tanstack-query';

import { axiosClient } from '~/utils/axios';

import { currentUserAtom } from './auth';

export type User = {
  _id: string;
  name: string;
};

export const getOtherUsersAtom = atomWithQuery((get) => ({
  queryKey: ['getOtherUsers'],
  queryFn: async () => {
    const res = await axiosClient<{ data: User[] }>({
      method: 'get',
      url: '/users/all',
      headers: {
        Authorization: get(currentUserAtom)?.id,
      },
    });
    return res.data;
  },
}));
