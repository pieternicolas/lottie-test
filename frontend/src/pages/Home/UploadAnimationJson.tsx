import { useAtom, useAtomValue } from 'jotai';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { currentUserAtom } from '~/store/auth';
import { Project, saveNewProjectAtom } from '~/store/project';
import { lottieParser } from '~/utils/lottie-parser';

const UploadAnimationJson = () => {
  const navigate = useNavigate();

  const currentUser = useAtomValue(currentUserAtom);
  const [{ mutateAsync: saveNewProjectMutate }] = useAtom(saveNewProjectAtom);

  const [animationData, setAnimationData] = useState<Project | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!e.target?.files?.[0]) {
      return;
    }

    setHasError(false);
    fileReader.readAsText(e.target?.files?.[0], 'UTF-8');
    fileReader.onload = (e) => {
      setAnimationData(JSON.parse(e.target?.result as string));
    };
  };

  useEffect(() => {
    (async () => {
      if (animationData) {
        try {
          const animationDataParsed = lottieParser.parse(
            JSON.stringify(animationData)
          );

          if (!animationDataParsed) {
            throw new Error("Can't parse animation data");
          }

          const res = await saveNewProjectMutate({
            name: 'New Project',
            animation: JSON.parse(JSON.stringify(animationData)),
            owner: String(currentUser?.id),
            collaborators: [String(currentUser?.id)],
          });

          if (res.data) {
            navigate(`/project/${res.data?._id}`);
          }
        } catch (error) {
          console.error(error);
          setHasError(true);
        }
      }
    })();
  }, [animationData]);

  return (
    <>
      <label
        htmlFor="file-upload"
        className="p-4 block hover:cursor-pointer hover:bg-blue-200 transition-colors rounded-lg text-center"
      >
        <span>Upload a valid Lottie JSON file here</span>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="application/JSON"
          onChange={handleChange}
        />
        {hasError && (
          <p className=" text-sm text-red-500 text-center mt-2">
            Invalid JSON file. Please upload a valid Lottie JSON file.
          </p>
        )}
      </label>
    </>
  );
};

export default UploadAnimationJson;
