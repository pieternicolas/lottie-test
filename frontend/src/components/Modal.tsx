import { RiCloseLine } from '@remixicon/react';

import Card from './Card';

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title?: string;
};

const Modal = ({ children, open, onClose, title }: ModalProps) => {
  const closeModal = () => {
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="absolute top-0 left-0 w-screen h-screen bg-black/50 z-10 flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          if (e.target === e.currentTarget) {
            closeModal();
          }
        }}
      >
        <Card className="w-1/2 max-w-[500px]">
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">{title}</p>
            <button className="font-bold" onClick={closeModal}>
              <RiCloseLine />
            </button>
          </div>

          <div className="relative">{children}</div>
        </Card>
      </div>
    </>
  );
};

export default Modal;
