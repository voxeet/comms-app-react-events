import { Space, useParticipants } from '@dolbyio/comms-uikit-react';
import { DrawerMainContent, DrawerHeader } from '@src/components/SideDrawer';
import { ChatMessage } from '@src/types/chat';
import { useEffect, useRef, useState, UIEvent, useCallback } from 'react';

import styles from './Chat.module.scss';
import { Message } from './Message/Message';
import { MessageInput } from './MessageInput/MessageInput';
import { NoMessages } from './NoMessages/NoMessages';
import { UnreadMessagesButton } from './UnreadMessagesButton/UnreadMessagesButton';

type ChatProps = {
  messages: ChatMessage[];
  numUnreadMessages?: number;
  onMessageSubmit: (text: string) => void;
  onDeleteMessageClick?: (message: ChatMessage) => void;
  onRead: () => void;
};

export const Chat = ({ messages, numUnreadMessages = 0, onMessageSubmit, onDeleteMessageClick, onRead }: ChatProps) => {
  const { participant } = useParticipants();
  const [messageInput, setMessageInput] = useState('');

  const messagesRef = useRef<HTMLDivElement>(null);
  const [isScrollAtBottom, setIsScrollAtBottom] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (!messagesRef.current) {
      return;
    }
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    setIsScrollAtBottom(true);
    onRead();
  }, [onRead]);

  // Scroll to bottom on mount
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom, onRead]);

  // If scroll is already at the bottom when a new message is received, keep the scroll at the bottom
  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }
    if (isScrollAtBottom) {
      scrollToBottom();
    }
  }, [messages, isScrollAtBottom, scrollToBottom]);

  const updateMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value.trimStart());
  };

  const handleMessagesScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight) {
      setIsScrollAtBottom(true);
      onRead();
    } else {
      setIsScrollAtBottom(false);
    }
  };

  const handleSubmit = () => {
    if (!messageInput) return;
    onMessageSubmit(messageInput);
    setMessageInput('');
    scrollToBottom();
  };

  return (
    <Space fw fh testID="Chat" className={styles.container}>
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
            <div data-testid="MessageBlock" className={styles.messages}>
              <div ref={messagesRef} className={styles.scroll} onScroll={handleMessagesScroll}>
                {messages.length === 0 ? (
                  <NoMessages />
                ) : (
                  messages.map((m) => (
                    <Message
                      key={m.timeToken}
                      message={m}
                      onDeleteMessageClick={onDeleteMessageClick}
                      isOwnedByLocalUser={participant ? participant.id === m.uuid : false}
                    />
                  ))
                )}
              </div>
              {numUnreadMessages > 0 && !isScrollAtBottom && (
                <div className={styles.unreadButton}>
                  <UnreadMessagesButton numUnreadMessages={numUnreadMessages} onClick={scrollToBottom} />
                </div>
              )}
            </div>
            <div className={styles.input}>
              <MessageInput
                placeholder="Type your message"
                value={messageInput}
                onChange={updateMessageInput}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        </Space>
      </DrawerMainContent>
    </Space>
  );
};
