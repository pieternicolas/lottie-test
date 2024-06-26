import { useAtom, useSetAtom } from 'jotai';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDebounce, useDeepCompareEffect } from 'ahooks';
import { RESET } from 'jotai/utils';

import {
  Project,
  ProjectAnimation,
  getProjectByIdAtom,
  projectIdAtom,
} from '~/store/project';
import { socket } from '~/utils/socket';
import RangeInput from '~/components/RangeInput';
import Button from '~/components/Button';
import Modal from '~/components/Modal';

import LayerList from './LayerList';
import InviteUserModal from './InviteUserModal';

const ProjectView = () => {
  const { projectId } = useParams();
  const [openModal, setOpenModal] = useState(false);

  const setProjectId = useSetAtom(projectIdAtom);
  const [{ data }] = useAtom(getProjectByIdAtom);

  const [hasEdited, setHasEdited] = useState(false);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const throttledProjectData = useDebounce(projectData, { wait: 500 });

  const handleChangeSpeed = (value: number) => {
    setHasEdited(true);
    setProjectData((prev) =>
      prev
        ? ({
            ...prev,
            animation: {
              ...prev.animation,
              fr: value,
            },
          } as Project)
        : null
    );
  };

  const handleUpdateLayers = (layers: ProjectAnimation['layers']) => {
    setHasEdited(true);
    setProjectData((prev) =>
      prev
        ? ({
            ...prev,
            animation: {
              ...prev.animation,
              layers,
            },
          } as Project)
        : null
    );
  };

  useEffect(() => {
    const handleOnConnect = () => {
      socket.emit('joinProject', projectId);
    };

    socket.connect();
    socket.on('connect', handleOnConnect);
    return () => {
      setProjectId(RESET);
      socket.off('connect', handleOnConnect);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleNewAnimation = (project: Project) => {
      setProjectData(project);
      setHasEdited(false);
    };

    socket.on('getNewAnimation', handleNewAnimation);
    return () => {
      socket.off('getNewAnimation', handleNewAnimation);
    };
  }, []);

  useEffect(() => {
    if (projectId) setProjectId(projectId);
  }, [projectId]);

  useEffect(() => {
    if (data?.data) {
      setProjectData(data?.data);
    }
  }, [data]);

  useDeepCompareEffect(() => {
    if (hasEdited) {
      socket.emit('updateAnimation', throttledProjectData);
    }
  }, [throttledProjectData, hasEdited]);

  return (
    <>
      <div className="flex h-full">
        <div className="flex-1 p-4 border-r border-gray-700 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-blue-500 hover:underline hover:text-blue-700"
              >
                Back
              </Link>
              <p className="font-semibold text-xl">
                Project: {projectData?.name}
              </p>
            </div>

            <Button onClick={() => setOpenModal(true)}>
              Manage Collaborators
            </Button>
          </div>

          <div className="flex items-center justify-center flex-1">
            <Lottie
              animationData={projectData?.animation}
              className="w-full max-w-[500px]"
            />
          </div>
        </div>
        <div className="flex-1 flex min-w-[350px] max-w-[30vw]">
          <div className="p-4 border-r border-gray-300 w-1/2">
            <p className="text-lg font-bold mb-2">Controls</p>

            <RangeInput
              label="Framerate"
              min={0}
              max={120}
              value={Number(projectData?.animation?.fr ?? 0)}
              onChange={handleChangeSpeed}
              step={1}
            />
          </div>

          <div className="w-1/2 p-4">
            <LayerList
              layers={projectData?.animation?.layers ?? []}
              onUpdateLayers={handleUpdateLayers}
            />
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={`Manage Collaborators on "${projectData?.name}"`}
      >
        <InviteUserModal onClose={() => setOpenModal(false)} />
      </Modal>
    </>
  );
};

export default ProjectView;
