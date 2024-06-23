import * as z from 'zod';
import { atomWithMutation } from 'jotai-tanstack-query';
import { atomWithStorage } from 'jotai/utils';
import axios from 'axios';

export const loginSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Name is required',
  }),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const currentUserAtom = atomWithStorage<{
  name: string;
  id: string;
} | null>('currentUser', null);

export const loginAtom = atomWithMutation(() => ({
  mutationKey: ['login'],
  mutationFn: async (data: LoginFormData) => {
    const res = await axios({
      method: 'post',
      url: `${import.meta.env.VITE_API_URL}/auth/login`,
      data,
    });

    return res.data;
  },
}));
