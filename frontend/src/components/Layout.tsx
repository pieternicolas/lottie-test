import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { RiCloseLine, RiMessage2Line } from '@remixicon/react';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { currentUserAtom } from '~/store/auth';
import { getOtherUsersAtom } from '~/store/user';
import { getAllChatsAtom } from '~/store/chat';
import { socket } from '~/utils/socket';

import Button from './Button';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  const [openChatDrawer, setOpenChatDrawer] = useState(false);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const [{ data: usersData }] = useAtom(getOtherUsersAtom);
  const [{ data: existingChatsData }] = useAtom(getAllChatsAtom);

  const usersList = useMemo(() => usersData?.data ?? null, [usersData]);
  const existingChats = useMemo(
    () => existingChatsData?.data ?? null,
    [existingChatsData]
  );

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
      console.log(chat, 'chat');
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  console.log(existingChats);

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

      <div className="border-t border-gray-500 shadow-lg flex justify-end">
        <div className="px-4 py-2 bg-white border-l border-gray-200 relative">
          <div className="flex gap-8">
            <p>Chats</p>
            {openChatDrawer ? (
              <RiCloseLine
                className="cursor-pointer hover:text-red-500"
                onClick={() => setOpenChatDrawer(false)}
              />
            ) : (
              <RiMessage2Line
                className="cursor-pointer hover:text-blue-500"
                onClick={() => setOpenChatDrawer(true)}
              />
            )}
          </div>

          <div
            className={clsx(
              'absolute bottom-full right-0 flex flex-col bg-white rounded-l border border-gray-200 w-[250px] max-w-[40vh] overflow-y-auto',
              openChatDrawer ? '' : 'hidden'
            )}
          >
            {usersList?.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  socket.emit('sendMessage', {
                    receiverId: user._id,
                    message: 'Hello!',
                  });
                }}
                className="hover:bg-blue-100 cursor-pointer px-4 py-2"
              >
                <p>{user.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
