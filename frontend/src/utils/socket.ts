import { io } from 'socket.io-client';

export const socket: ReturnType<typeof io> = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
  auth: {
    token: JSON.parse(localStorage.getItem('currentUser') || '{}')?.id ?? null,
  },
});
