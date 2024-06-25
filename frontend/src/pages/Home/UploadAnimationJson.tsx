import { useSetAtom } from 'jotai';
import { ChangeEvent, useEffect, useState } from 'react';

import { Project, projectAtom } from '~/store/project';
import { lottieParser } from '~/utils/lottie-parser';

const UploadAnimationJson = () => {
  const setProject = useSetAtom(projectAtom);

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
    if (animationData) {
      try {
        setProject(lottieParser.parse(JSON.stringify(animationData)));
      } catch (error) {
        console.error(error);
        setHasError(true);
      }
    }
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
