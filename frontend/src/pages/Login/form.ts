import * as z from 'zod';

export const loginSchema = z.object({
  name: z.string().trim().min(1, {
    message: 'Name is required',
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormData = {
  name: '',
};
