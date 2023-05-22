import { Icon } from '@dolbyio/comms-uikit-react';
import { useEffect, useRef, useState } from 'react';

import styles from './MessageInput.module.scss';

export type MessageInputProps = {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
};

export const MessageInput = ({ placeholder, value, onChange, onSubmit }: MessageInputProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const onFocus = () => setIsFocused(true);
  const onBlur = () => setIsFocused(false);

  //  Set the height of the textarea dynamically based on the size of its content
  //  See article: https://medium.com/@oherterich/creating-a-textarea-with-dynamic-height-using-react-and-typescript-5ed2d78d9848
  useEffect(() => {
    if (textAreaRef.current) {
      // Reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = '0px';
      const { scrollHeight } = textAreaRef.current;
      // Set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value. There is a 4px offset to account for border width
      textAreaRef.current.style.height = `${scrollHeight + 4}px`;
    }
  }, [value]);

  return (
    <div className={styles.wrapper}>
      <textarea
        data-testid="TypeMessage"
        ref={textAreaRef}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        className={styles.textArea}
        autoComplete="false"
        value={value}
        rows={1}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && value) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <button data-testid="SendMessage" className={styles.sendMessageButton} onClick={onSubmit} type="button">
        <Icon name="sendMessage" size="m" color={isFocused ? 'white' : 'grey.300'} />
      </button>
    </div>
  );
};
