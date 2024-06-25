import axios from 'axios';
import { atom } from 'jotai';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';

import { currentUserAtom } from './auth';

export type Project = Record<string, any>;

export const chosenProjectJsonUrlAtom = atom<string>('');

export const getProjectJsonAtom = atomWithQuery((get) => ({
  queryKey: ['getProjectJson', get(chosenProjectJsonUrlAtom)],
  queryFn: async () => {
    const res = await axios<Project>({
      method: 'get',
      url: get(chosenProjectJsonUrlAtom),
    });
    return res.data;
  },
  enabled: Boolean(get(chosenProjectJsonUrlAtom)),
}));

export const saveNewProjectAtom = atomWithMutation((get) => ({
  mutationKey: ['saveNewProject'],
  mutationFn: async (project: Project) => {
    const res = await axios({
      method: 'post',
      baseURL: import.meta.env.VITE_API_URL,
      url: '/projects/new',
      data: {
        name: project.name,
        animation: project.animation,
      },
      headers: {
        Authorization: `Bearer ${get(currentUserAtom)?.id}`,
      },
    });

    return res.data;
  },
}));

export const projectIdAtom = atom<string>('');
export const projectAtom = atom<Project | null>(null);

export const getProjectByIdAtom = atomWithQuery((get) => ({
  queryKey: ['getProjectById', get(projectIdAtom)],
  queryFn: async () => {
    const res = await axios<{
      data: Project;
    }>({
      method: 'get',
      baseURL: import.meta.env.VITE_API_URL,
      url: `/projects/${get(projectIdAtom)}`,
      headers: {
        Authorization: `Bearer ${get(currentUserAtom)?.id}`,
      },
    });
    return res.data;
  },
  enabled: Boolean(get(projectIdAtom)),
}));
