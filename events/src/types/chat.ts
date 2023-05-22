import { UserMetadata } from '@context/PubNubContext';

export type ChatMessage = {
  text: string;
  timeToken: string;
} & UserMetadata;
