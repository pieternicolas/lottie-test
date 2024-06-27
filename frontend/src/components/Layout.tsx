import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { RiCloseLine, RiMessage2Line } from '@remixicon/react';
import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { currentUserAtom } from '~/store/auth';
import { User, getOtherUsersAtom } from '~/store/user';
import {
  ChatMessage,
  activeChatAtom,
  activeChatRoomsAtom,
  getAllChatsAtom,
} from '~/store/chat';
import { socket } from '~/utils/socket';

import Button from './Button';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const [{ data: usersData }] = useAtom(getOtherUsersAtom);
  const [{ data: existingChatsData }] = useAtom(getAllChatsAtom);
  const [activeChat, setActiveChat] = useAtom(activeChatAtom);
  const [activeChatRooms, setActiveChatRooms] = useAtom(activeChatRoomsAtom);

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
    const handleNewMessage = (chat: ChatMessage) => {
      setActiveChatRooms((prevState) => {
        const chatRoom = prevState.find(
          (chatRoom) => chatRoom.receiverId === chat.user
        );

        if (chatRoom) {
          chatRoom.messages.push({
            message: chat.message,
            time: chat.time,
            user: chat.user,
          });
        }

        return prevState;
      });
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  const handleOpenChat = (user: User) => {
    setActiveChat(user._id);

    if (!activeChatRooms.find((chat) => chat.receiverId === user._id)) {
      setActiveChatRooms([
        ...activeChatRooms,
        {
          receiverId: user._id,
          receiverName: user.name,
          messages:
            existingChats?.find((item) => item.members.includes(user._id))
              ?.messages ?? [],
        },
      ]);
    }
  };

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
        <div className="flex-1 flex justify-end">
          {activeChatRooms.map((chat) => (
            <div
              key={chat.receiverId}
              className="border-l border-gray-200 relative"
            >
              <p>{chat.receiverName}</p>

              <div
                className={clsx(
                  'absolute bottom-full -right-[1px] bg-white rounded-t rounded-l border border-gray-200 p-4 w-[250px] flex flex-col-reverse gap-2',
                  activeChat !== chat.receiverId ? 'hidden' : ''
                )}
              >
                {chat.messages.map((message) => (
                  <p
                    key={message.time}
                    className={clsx(
                      message.user === chat.receiverId
                        ? 'self-start'
                        : 'self-end bg-green-400 rounded-full px-4 py-1'
                    )}
                  >
                    {message.message}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 py-2 bg-white border-l border-gray-200 relative">
          <div className="flex gap-8">
            <p>Chats</p>
            {activeChat === 'all' ? (
              <RiCloseLine
                className="cursor-pointer hover:text-red-500"
                onClick={() => setActiveChat(RESET)}
              />
            ) : (
              <RiMessage2Line
                className="cursor-pointer hover:text-blue-500"
                onClick={() => setActiveChat('all')}
              />
            )}
          </div>

          <div
            className={clsx(
              'absolute bottom-full right-0 flex flex-col bg-white rounded-l border border-gray-200 w-[250px] max-w-[40vh] overflow-y-auto',
              activeChat === 'all' ? '' : 'hidden'
            )}
          >
            {usersList?.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  handleOpenChat(user);
                  // socket.emit('sendMessage', {
                  //   receiverId: user._id,
                  //   message: 'Hello!',
                  // });
                }}
                className="hover:bg-blue-100 cursor-pointer px-4 py-2 text-left"
              >
                <p>{user.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
