import { RiCloseLine, RiMessage2Line } from '@remixicon/react';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { RESET } from 'jotai/utils';
import { useEffect, useMemo } from 'react';

import {
  ChatMessage,
  ChatRoom,
  activeChatAtom,
  chatRoomAtom,
  getAllChatsAtom,
} from '~/store/chat';
import { User, getOtherUsersAtom } from '~/store/user';
import { socket } from '~/utils/socket';
import ChatWindow from './ChatWindow';

const Chat = () => {
  const [{ data: usersData }] = useAtom(getOtherUsersAtom);
  const usersList = useMemo(() => usersData?.data ?? null, [usersData]);

  const [{ data: existingChatsData }] = useAtom(getAllChatsAtom);
  const existingChats = useMemo(
    () => existingChatsData?.data ?? null,
    [existingChatsData]
  );

  const [activeChat, setActiveChat] = useAtom(activeChatAtom);
  const [chatroom, dispatchChatroomAction] = useAtom(chatRoomAtom);

  useEffect(() => {
    const handleOnConnect = () => {
      socket.emit('joinChatChannel');
    };

    socket.connect();
    socket.on('connect', handleOnConnect);
    return () => {
      socket.off('connect', handleOnConnect);
      socket.disconnect();
      dispatchChatroomAction({ type: 'reset' });
    };
  }, []);

  useEffect(() => {
    const handleNewMessage = (chat: ChatMessage) => {
      dispatchChatroomAction({ type: 'newMessage', payload: chat });
    };

    socket.on('newMessage', handleNewMessage);
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, []);

  const handleOpenChat = (user: User) => {
    setActiveChat(user._id);
    dispatchChatroomAction({
      type: 'openChat',
      payload: {
        receiverId: user._id,
        receiverName: user.name,
        messages:
          existingChats?.find((item) => item.members.includes(user._id))
            ?.messages ?? [],
      },
    });
  };

  return (
    <>
      <div className="flex-1 flex justify-end">
        {Array.from(chatroom).map(([receiverId, chat]: [string, ChatRoom]) => (
          <ChatWindow key={receiverId} chat={chat} />
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
              }}
              className="hover:bg-blue-100 cursor-pointer px-4 py-2 text-left"
            >
              <p>{user.name}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Chat;
