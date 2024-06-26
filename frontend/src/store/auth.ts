import * as z from 'zod';
import { atomWithMutation } from 'jotai-tanstack-query';
import { atomWithStorage } from 'jotai/utils';

import { axiosClient } from '~/utils/axios';

export const loginSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Name is required',
  }),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const currentUserAtom = atomWithStorage<{
  name: string;
  id: string;
} | null>('currentUser', null, undefined, { getOnInit: true });

export const loginAtom = atomWithMutation(() => ({
  mutationKey: ['login'],
  mutationFn: async (data: LoginFormData) => {
    const res = await axiosClient({
      method: 'post',
      url: '/auth/login',
      data,
    });

    return res.data;
  },
}));
