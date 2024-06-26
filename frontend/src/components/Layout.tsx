import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useNavigate } from 'react-router-dom';

import { currentUserAtom } from '~/store/auth';

import Button from './Button';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end gap-4 items-center bg-white border-b border-gray-500 shadow px-4 py-2">
        <p>Hello, {currentUser?.name}!</p>
        <Button
          className="bg-red-500 hover:bg-red-700"
          onClick={() => {
            setCurrentUser(RESET);
            navigate(0);
          }}
        >
          Logout
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
    </div>
  );
};

export default Layout;
