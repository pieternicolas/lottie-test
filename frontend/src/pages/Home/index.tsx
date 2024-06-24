import { ChangeEvent, useState } from 'react';

import Card from '~/components/Card';

const Home = () => {
  const [animationData, setAnimationData] = useState<any>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (!e.target?.files?.[0]) {
      return;
    }

    fileReader.readAsText(e.target?.files?.[0], 'UTF-8');
    fileReader.onload = (e) => {
      setAnimationData(JSON.parse(e.target?.result as string));
    };
  };

  return (
    <>
      <div className="w-full h-full bg-gray-200 flex gap-4 items-center justify-center">
        <Card className="p-0">
          <label
            htmlFor="file-upload"
            className="p-4 block hover:cursor-pointer hover:bg-blue-400 transition-colors rounded-lg hover:text-white"
          >
            <span>Upload a valid Lottie JSON file here</span>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="application/JSON"
              onChange={handleChange}
            />
          </label>
        </Card>

        <p>OR</p>

        <Card className="p-0">
          <p className="p-4 hover:bg-orange-400 rounded-lg hover:text-white hover:cursor-pointer transition-colors">
            Browse the featured animations list
          </p>
        </Card>
      </div>
    </>
  );
};

export default Home;
