import { useAtom, useSetAtom } from 'jotai';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebounce, useDeepCompareEffect } from 'ahooks';

import {
  Project,
  ProjectAnimation,
  getProjectByIdAtom,
  projectIdAtom,
} from '~/store/project';
import { socket } from '~/utils/socket';
import RangeInput from '~/components/RangeInput';
import LayerList from './LayerList';

const ProjectView = () => {
  const { projectId } = useParams();

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
    socket.connect();
    socket.on('connect', () => {
      socket.emit('joinProject', projectId);
    });
    return () => {
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
    <div className="flex h-full">
      <div className="flex-1 p-4 border-r border-gray-700 flex items-center justify-center">
        <Lottie
          animationData={projectData?.animation}
          className="w-full max-w-[500px]"
        />
      </div>
      <div className="flex-1 flex max-w-[30vw]">
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
  );
};

export default ProjectView;
