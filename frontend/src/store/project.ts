import axios from 'axios';
import { atomWithReset } from 'jotai/utils';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';

import { currentUserAtom } from './auth';

export type ProjectAnimation = {
  nm: string;
  w: number;
  h: number;
  layers: Array<Record<string, any>>;
  fr: number;
};

export type Project = {
  _id: string;
  name: string;
  owners: Array<string>;
  animation: ProjectAnimation;
};

export const chosenProjectJsonUrlAtom = atomWithReset<string>('');

export const getProjectJsonAtom = atomWithQuery((get) => ({
  queryKey: ['getProjectJson', get(chosenProjectJsonUrlAtom)],
  queryFn: async () => {
    const res = await axios<ProjectAnimation>({
      method: 'get',
      url: get(chosenProjectJsonUrlAtom),
    });
    return res.data;
  },
  enabled: Boolean(get(chosenProjectJsonUrlAtom)),
}));

export const saveNewProjectAtom = atomWithMutation((get) => ({
  mutationKey: ['saveNewProject'],
  mutationFn: async (project: Omit<Project, '_id'>) => {
    const res = await axios({
      method: 'post',
      baseURL: import.meta.env.VITE_API_URL,
      url: '/projects/new',
      data: {
        name: project.name,
        animation: project.animation,
      },
      headers: {
        Authorization: get(currentUserAtom)?.id,
      },
    });

    return res.data;
  },
}));

export const projectIdAtom = atomWithReset<string>('');

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
        Authorization: get(currentUserAtom)?.id,
      },
    });
    return res.data;
  },
  enabled: Boolean(get(projectIdAtom)),
}));

export const getProjectsAtom = atomWithQuery((get) => ({
  queryKey: ['getProjects'],
  queryFn: async () => {
    const res = await axios<{
      data: Array<Project>;
    }>({
      method: 'get',
      baseURL: import.meta.env.VITE_API_URL,
      url: '/projects',
      headers: {
        Authorization: get(currentUserAtom)?.id,
      },
    });
    return res.data;
  },
}));

export const inviteUserToProjectAtom = atomWithMutation((get) => ({
  mutationKey: ['inviteUserToProject'],
  mutationFn: async (userIds: string[]) => {
    console.log(get(projectIdAtom), 'as');

    const res = await axios({
      method: 'patch',
      baseURL: import.meta.env.VITE_API_URL,
      url: `/projects/${get(projectIdAtom)}/invite`,
      data: {
        userIds,
      },
      headers: {
        Authorization: get(currentUserAtom)?.id,
      },
    });
    return res.data;
  },
}));
