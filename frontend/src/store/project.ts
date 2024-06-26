import { atomWithReset, atomWithStorage } from 'jotai/utils';
import { atomWithMutation, atomWithQuery } from 'jotai-tanstack-query';

import { axiosClient } from '~/utils/axios';

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
  owner: string;
  collaborators: Array<string>;
  animation: ProjectAnimation;
};

export const chosenProjectJsonUrlAtom = atomWithReset<string>('');

export const getProjectJsonAtom = atomWithQuery((get) => ({
  queryKey: ['getProjectJson', get(chosenProjectJsonUrlAtom)],
  queryFn: async () => {
    const res = await axiosClient<ProjectAnimation>({
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
    const res = await axiosClient({
      method: 'post',
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
export const projectAtom = atomWithStorage<Project | null>(
  'project',
  null,
  undefined,
  { getOnInit: true }
);

export const getProjectByIdAtom = atomWithQuery((get) => ({
  queryKey: ['getProjectById', get(projectIdAtom)],
  queryFn: async () => {
    const res = await axiosClient<{
      data: Project;
    }>({
      method: 'get',
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
    const res = await axiosClient<{
      data: Array<Project>;
    }>({
      method: 'get',
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
    const res = await axiosClient({
      method: 'patch',
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
