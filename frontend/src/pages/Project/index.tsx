import { useAtom, useSetAtom } from 'jotai';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDebounce, useDeepCompareEffect } from 'ahooks';

import { Project, getProjectByIdAtom, projectIdAtom } from '~/store/project';
import { socket } from '~/utils/socket';

const ProjectView = () => {
  const { projectId } = useParams();

  const setProjectId = useSetAtom(projectIdAtom);
  const [{ data }] = useAtom(getProjectByIdAtom);

  const [hasEdited, setHasEdited] = useState(false);
  const [projectData, setProjectData] = useState<Project | null>(null);
  const throttledProjectData = useDebounce(projectData, { wait: 500 });

  const handleChangeSpeed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasEdited(true);
    setProjectData((prev) =>
      prev
        ? ({
            ...prev,
            animation: {
              ...prev.animation,
              fr: Number(e.target.value),
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
        <div className="p-4 border-r border-gray-300 flex-1">
          <input
            type="range"
            min={0}
            max={120}
            value={projectData?.animation?.fr}
            onChange={handleChangeSpeed}
          />
        </div>

        <div className="flex-1 p-4">
          <p className="text-lg font-bold">Layers</p>
          {projectData?.animation?.layers.map((layer, index) => (
            <div key={index}>
              <p>{layer.nm}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
