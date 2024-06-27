import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { currentUserAtom } from '~/store/auth';
import { getOtherUsersAtom } from '~/store/user';
import { socket } from '~/utils/socket';

import Button from './Button';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [{ data: usersData }] = useAtom(getOtherUsersAtom);

  const usersList = useMemo(() => usersData?.data ?? null, [usersData]);

  useEffect(() => {
    const handleOnConnect = () => {
      socket.emit('joinChatChannel');
    };

    socket.connect();
    socket.on('connect', handleOnConnect);
    return () => {
      socket.off('connect', handleOnConnect);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleNewMessage = (chat: any) => {
      console.log(chat);
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

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

      <div className="border-t border-gray-500 shadow-lg px-4 py-4">
        {usersList?.map((user) => (
          <p
            key={user._id}
            onClick={() => {
              socket.emit('sendMessage', {
                receiverId: user._id,
                message: 'Hello!',
              });
            }}
          >
            {user.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Layout;
