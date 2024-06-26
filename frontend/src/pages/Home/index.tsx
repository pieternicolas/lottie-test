import { useState } from 'react';

import Card from '~/components/Card';
import Modal from '~/components/Modal';

import FeaturedAnimationList from './FeaturedAnimationList';
import UploadAnimationJson from './UploadAnimationJson';
import ProjectList from './ProjectList';

const Home = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <div className="flex flex-col justify-center items-center gap-4 max-h-[80vh] min-h-[300px] overflow-y-auto">
          <div className="flex gap-4 items-center">
            <Card className="!p-0">
              <UploadAnimationJson />
            </Card>

            <p>OR</p>

            <Card className="!p-0">
              <button
                className="p-4 hover:bg-orange-200 rounded-lg hover:cursor-pointer transition-colors"
                onClick={() => setOpenModal(true)}
              >
                Browse the featured animations list
              </button>
            </Card>
          </div>

          <ProjectList />
        </div>
      </div>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title="Featured Animations"
      >
        <FeaturedAnimationList />
      </Modal>
    </>
  );
};

export default Home;
