import { useAtom, useSetAtom } from 'jotai';
import Lottie from 'lottie-react';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Button from '~/components/Button';
import { getProjectByIdAtom, projectIdAtom } from '~/store/project';
import { socket } from '~/utils/socket';

const Project = () => {
  const { projectId } = useParams();

  const setProjectId = useSetAtom(projectIdAtom);
  const [{ data }] = useAtom(getProjectByIdAtom);

  const projectData = useMemo(() => data?.data ?? null, [data]);

  useEffect(() => {
    if (projectId) {
      setProjectId(projectId);
    }
  }, [projectId]);

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex h-full">
      <div className="flex-1 p-4 border-r border-gray-700">
        <Lottie animationData={projectData?.animation}></Lottie>
      </div>
      <div className="flex-1 p-4">
        <Button
          onClick={() => {
            socket.emit('TEST', 'asd');
          }}
        >
          save
        </Button>
      </div>
    </div>
  );
};

export default Project;
