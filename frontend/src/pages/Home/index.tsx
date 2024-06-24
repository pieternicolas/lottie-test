import { ChangeEvent, useEffect, useState } from 'react';

import Card from '~/components/Card';
import { lottieParser } from '~/utils/lottie-parser';

const Home = () => {
  const [animationData, setAnimationData] = useState<any>(null);
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
        console.log(lottieParser.parse(JSON.stringify(animationData)));
      } catch (error) {
        console.error(error);
        setHasError(true);
      }
    }
  }, [animationData]);

  return (
    <>
      <div className="w-full h-full bg-gray-200 flex gap-4 items-center justify-center">
        <Card className="p-0">
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
        </Card>

        <p>OR</p>

        <Card className="p-0">
          <p className="p-4 hover:bg-orange-200 rounded-lg hover:cursor-pointer transition-colors">
            Browse the featured animations list
          </p>
        </Card>
      </div>
    </>
  );
};

export default Home;
