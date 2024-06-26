import axios, { AxiosError } from 'axios';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export type ErrorResponse = AxiosError<{
  error: string;
}>;
