import axios from 'axios';
import { atomWithQuery } from 'jotai-tanstack-query';

import { currentUserAtom } from './auth';

export type User = {
  _id: string;
  name: string;
};

export const getOtherUsersAtom = atomWithQuery((get) => ({
  queryKey: ['getOtherUsers'],
  queryFn: async () => {
    const res = await axios<{ data: User[] }>({
      method: 'get',
      baseURL: import.meta.env.VITE_API_URL,
      url: '/users/all',
      headers: {
        Authorization: get(currentUserAtom)?.id,
      },
    });
    return res.data;
  },
}));
