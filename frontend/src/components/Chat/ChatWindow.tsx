import clsx from 'clsx';
import { useAtom } from 'jotai';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RESET } from 'jotai/utils';

import {
  ChatMessageFormData,
  ChatRoom,
  activeChatAtom,
  chatMessageSchema,
} from '~/store/chat';
import TextInput from '~/components/TextInput';
import { socket } from '~/utils/socket';

type ChatWindowProps = {
  chat: ChatRoom;
};

const chatDefaultValues: ChatMessageFormData = {
  message: '',
};

const ChatWindow = ({ chat }: ChatWindowProps) => {
  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: chatDefaultValues,
  });

  const [activeChat, setActiveChat] = useAtom(activeChatAtom);

  const onSubmit = handleSubmit((data) => {
    socket.emit('sendMessage', {
      receiverId: chat.receiverId,
      message: data.message,
    });
    reset(chatDefaultValues);
  });

  return (
    <>
      <div className="border-l border-gray-200 relative">
        <button
          onClick={() =>
            setActiveChat(
              activeChat === chat.receiverId ? RESET : chat.receiverId
            )
          }
          className="h-full px-4"
        >
          <p>{chat.receiverName}</p>
        </button>

        <form
          className={clsx(
            'absolute bottom-full -right-[1px] bg-white rounded-t rounded-l border border-gray-200 p-4 w-[300px] flex flex-col gap-2 max-h-[40vh]',
            activeChat !== chat.receiverId ? 'hidden' : ''
          )}
          onSubmit={onSubmit}
        >
          <div className="flex flex-col-reverse gap-2 flex-1 overflow-y-auto">
            {chat.messages
              .map((message) => (
                <p
                  key={message.time}
                  className={clsx(
                    'rounded-lg px-4 py-1 break-all',
                    message.user === chat.receiverId
                      ? 'self-start bg-gray-200'
                      : 'self-end bg-green-400'
                  )}
                >
                  {message.message}
                </p>
              ))
              .reverse()}
          </div>

          <Controller
            control={control}
            name="message"
            render={({ field, fieldState: { error } }) => (
              <TextInput
                name="message"
                onChange={field.onChange}
                value={field.value}
                error={error?.message}
              />
            )}
          />
        </form>
      </div>
    </>
  );
};

export default ChatWindow;
