import { useState } from 'react';

import Card from '~/components/Card';
import Modal from '~/components/Modal';

import FeaturedAnimationList from './FeaturedAnimationList';
import UploadAnimationJson from './UploadAnimationJson';

const Home = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <div className="w-full h-full bg-gray-200 flex gap-4 items-center justify-center">
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
