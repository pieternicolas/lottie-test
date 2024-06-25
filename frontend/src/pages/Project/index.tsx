import { useAtom, useSetAtom } from 'jotai';
import Lottie from 'lottie-react';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { getProjectByIdAtom, projectIdAtom } from '~/store/project';

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

  return (
    <div>
      <Lottie animationData={projectData?.animation}></Lottie>
    </div>
  );
};

export default Project;
