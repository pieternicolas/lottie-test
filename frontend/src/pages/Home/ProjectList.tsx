import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '~/components/Card';
import { getProjectsAtom } from '~/store/project';

const ProjectList = () => {
  const navigate = useNavigate();

  const [{ data: projectsData, isLoading }] = useAtom(getProjectsAtom);

  const projectsList = useMemo(() => {
    if (!isLoading) {
      return projectsData?.data ?? null;
    }
    return null;
  }, [projectsData]);

  return (
    <>
      <div className="w-full">
        <p className="text-center text-lg mb-2">
          {projectsList?.length
            ? `You have ${projectsList.length} existing projects`
            : 'You have no projects'}
        </p>

        {Number(projectsList?.length || 0) > 0 && (
          <Card>
            {projectsList?.map((project) => (
              <div
                key={project.name}
                className="px-4 py-2 hover:shadow cursor-pointer rounded hover:bg-blue-100"
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <p>{project.name}</p>
              </div>
            ))}
          </Card>
        )}
      </div>
    </>
  );
};

export default ProjectList;
