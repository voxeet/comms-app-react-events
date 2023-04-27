import { Input, ParticipantAvatar, Space } from '@dolbyio/comms-uikit-react';
import { DrawerMainContent, DrawerHeader } from '@src/components/SideDrawer';
import Text from '@src/components/Text';
import { ChatMessage } from '@src/types/chat';
import { useEffect, useMemo, useRef, useState } from 'react';

import styles from './Chat.module.scss';

type MessageProps = {
  message: ChatMessage;
};

const Message = ({ message }: MessageProps) => {
  const time = useMemo(() => {
    const d = new Date(message.timestamp);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }, [message.timestamp]);

  return (
    <div className={styles.message}>
      <ParticipantAvatar size="xs" participant={message.sender} />
      <div className={styles.right}>
        <div className={styles.header}>
          <Text>{message.sender}</Text>
          <Text color="grey.200">{time}</Text>
        </div>
        <Text color="grey.200">{message.text}</Text>
      </div>
    </div>
  );
};

type ChatProps = {
  messages: ChatMessage[];
  onMessageSubmit: (text: string) => void;
};

export const Chat = ({ messages, onMessageSubmit }: ChatProps) => {
  const [messageInput, setMessageInput] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);

  const updateMessageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
  };

  // Scroll to the bottom of the chat box when a new message is sent/received
  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  return (
    <Space fw fh className={styles.container}>
      <DrawerHeader
        labelKey="chat"
        color="grey.100"
        closeButtonBackgroundColor="grey.500"
        closeButtonIconColor="white"
        closeButtonStrokeColor="transparent"
      />
      <DrawerMainContent>
        <Space pv="s" ph="m" fh>
          <div className={styles.chat}>
            <div ref={messagesRef} className={styles.messages}>
              {messages.map((m) => (
                <Message key={m.timestamp} message={m} />
              ))}
            </div>
            <Input
              textColor="white"
              placeholder="Type your message"
              value={messageInput}
              onChange={updateMessageInput}
              onKeyDown={(e) => {
                if (e.key !== 'Enter' || !messageInput) return;
                onMessageSubmit(messageInput);
                setMessageInput('');
              }}
            />
          </div>
        </Space>
      </DrawerMainContent>
    </Space>
  );
};
