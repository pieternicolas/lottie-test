import { useAtom } from 'jotai';
import { currentUserAtom } from '~/store/auth';
import Button from './Button';
import { RESET } from 'jotai/utils';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end gap-4 items-center bg-white border-b border-gray-500 shadow px-4 py-2">
        <p>Hello, {currentUser?.name}!</p>
        <Button
          className="bg-red-500 hover:bg-red-700"
          onClick={() => setCurrentUser(RESET)}
        >
          Logout
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
    </div>
  );
};

export default Layout;
