import { PubNubContext, isUserMetadata } from '@context/PubNubContext';
import { useConference } from '@dolbyio/comms-uikit-react';
import { ChatMessage } from '@src/types/chat';
import { env } from '@src/utils/env';
import PubNub from 'pubnub';
import { useCallback, useContext, useEffect, useState } from 'react';

const VITE_MAX_MESSAGES = parseInt(env('VITE_MAX_MESSAGES') ?? '', 10);
const MAX_MESSAGES = Number.isNaN(VITE_MAX_MESSAGES) ? 30 : VITE_MAX_MESSAGES;
const MESSAGE_ACTION_DELETE_TYPE = 'delete';

export function useChat() {
  const { pubnub, status, userMetadata, addListeners } = useContext(PubNubContext);
  const { conference } = useConference();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [firstUnreadMessage, setFirstUnreadMessage] = useState<ChatMessage>();
  const [hasFetchedHistory, setHasFetchedHistory] = useState(false);
  const numUnreadMessages = firstUnreadMessage
    ? messages.length - Math.max(messages.indexOf(firstUnreadMessage), 0)
    : 0;

  const sendMessage = useCallback(
    (text: string) => {
      if (!conference) {
        throw new Error('Could not send chat message. Conference is undefined.');
      } else if (!pubnub) {
        throw new Error('Could not send chat message. PubNub client is not initialized yet.');
      } else if (!userMetadata) {
        throw new Error('Could not send chat message. Could not get metadata for local user.');
      }
      return pubnub.publish({
        channel: conference.id,
        message: text,
        meta: userMetadata,
      });
    },
    [conference, pubnub, userMetadata],
  );

  const deleteMessage = useCallback(
    async (message: ChatMessage) => {
      if (!conference) {
        throw new Error('Could not delete chat message. Conference is undefined.');
      } else if (!pubnub) {
        throw new Error('Could not delete chat message. PubNub client is not initialized yet.');
      }

      await new Promise<void>((resolve, reject) => {
        // deleteMessages can only delete messages within a specified timeframe. By using a
        // message's timeToken for `end` and timeToken-1 for `start`, we can delete ONLY that message.
        // https://www.pubnub.com/docs/sdks/javascript/api-reference/storage-and-playback#delete-specific-message-from-a-message-persistence
        pubnub.deleteMessages(
          {
            channel: conference.id,
            // PubNub time tokens are 17 digits long which is larger than Number.MAX_SAFE_INTEGER. Parsing time tokens as a regular
            // Number results in precision errors so we need to use BigInt instead.
            start: (BigInt(message.timeToken) - BigInt(1)).toString(),
            end: message.timeToken,
          },
          (response) => {
            if (response.statusCode !== 200 || response.error) {
              return reject(new Error(`Could not delete chat message. Error: ${response.errorData}`));
            }
            return resolve();
          },
        );
      });

      // Once the message has been deleted, notify all other users to delete their local copy of the message
      return pubnub.addMessageAction({
        channel: conference.id,
        messageTimetoken: message.timeToken,
        action: {
          type: MESSAGE_ACTION_DELETE_TYPE,
          value: '.', // Placeholder value - doesn't do anything but is a required property for `action`
        },
      });
    },
    [conference, pubnub],
  );

  const markAsRead = useCallback(() => {
    setFirstUnreadMessage(undefined);
  }, []);

  // Fetch message history
  useEffect(() => {
    async function fetchMessages() {
      if (!conference || !pubnub || hasFetchedHistory) {
        return;
      }

      setHasFetchedHistory(true);
      const res = await pubnub.fetchMessages({
        channels: [conference.id],
        count: MAX_MESSAGES,
        includeMeta: true,
      });
      const history = res.channels[conference.id];

      if (!history) {
        return;
      }

      setMessages((messages) =>
        [
          ...history.map<ChatMessage>((m) => {
            if (!isUserMetadata(m.meta)) {
              throw new Error('Could not process chat message. User metadata is invalid or missing.');
            }
            return {
              uuid: m.meta.uuid,
              username: m.meta.username,
              role: m.meta.role,
              text: m.message,
              timeToken: m.timetoken.toString(),
            };
          }),
          ...messages, // Merge messages in case new messages have been received while history was being fetched
        ].slice(-MAX_MESSAGES),
      );
    }
    fetchMessages();
  }, [conference, pubnub, hasFetchedHistory]);

  // Set up listeners to receive messages and message actions
  useEffect(() => {
    if (!conference || status !== 'ready') {
      return () => {};
    }

    const handleMessage = (e: PubNub.MessageEvent) => {
      if (e.channel !== conference?.id) {
        return;
      }
      if (!isUserMetadata(e.userMetadata)) {
        throw new Error('Could not process chat message. User metadata is invalid or missing.');
      }
      const newMsg: ChatMessage = {
        uuid: e.userMetadata.uuid,
        username: e.userMetadata.username,
        role: e.userMetadata.role,
        text: e.message,
        timeToken: e.timetoken,
      };
      setMessages((messages) => [...messages, newMsg].slice(-MAX_MESSAGES));
      setFirstUnreadMessage((prev) => prev ?? newMsg);
    };

    const handleMessageAction = (e: PubNub.MessageActionEvent) => {
      if (e.channel !== conference?.id || e.data.type !== MESSAGE_ACTION_DELETE_TYPE) {
        return;
      }

      let filtered: ChatMessage[] = [];
      setMessages((prev) => {
        filtered = prev.filter((m) => m.timeToken !== e.data.messageTimetoken);
        return filtered;
      });
      setFirstUnreadMessage((prev) => {
        if (!prev || prev.timeToken !== e.data.messageTimetoken) {
          return prev;
        }
        // If the deleted message was the first unread message, mark the next message as the first unread message
        return filtered[filtered.indexOf(prev) + 1];
      });
    };

    const removeListeners = addListeners({ message: handleMessage, messageAction: handleMessageAction });
    return removeListeners;
  }, [conference, status, addListeners]);

  // Subscribe to the chat channel
  useEffect(() => {
    if (!conference || !pubnub) {
      return () => {};
    }

    pubnub.subscribe({ channels: [conference.id] });
    return () => {
      pubnub.unsubscribe({ channels: [conference.id] });
    };
  }, [conference, pubnub]);

  return {
    messages,
    numUnreadMessages,
    sendMessage,
    deleteMessage,
    markAsRead,
  };
}
