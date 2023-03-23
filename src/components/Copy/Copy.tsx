import { Tooltip, IconButton, IconButtonProps, useTheme } from '@dolbyio/comms-uikit-react';
import Text from '@src/components/Text';
import { copyTextToClipboard } from '@src/utils/copyTextToClipboard';
import { useState } from 'react';

import styles from './Copy.module.scss';

type CopyProps = Omit<IconButtonProps, 'icon' | 'onClick'> & {
  /** Text to display next to the copy button. If no value specified, copyValue will be used instead. */
  label?: string;
  /** The string to copy to the clipboard when the copy button is clicked */
  copyValue: string;
  tooltipText: string;
  successText: string;
};

export const Copy = ({ label, copyValue, tooltipText, successText, testID }: CopyProps) => {
  const [copied, setCopied] = useState(false);
  const { isDesktop } = useTheme();
  const copy = async () => {
    if (!isDesktop && navigator.share) {
      await navigator.share({
        url: copyValue,
      });
    }

    copyTextToClipboard(copyValue);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div data-testid={testID} className={styles.copy}>
      <Tooltip testID="Tooltip" position="top" text={copied ? successText : tooltipText}>
        <IconButton testID="CopyButton" icon="copy" size="m" backgroundColor="transparent" onClick={copy} />
      </Tooltip>
      <Text testID="Link">{label ?? copyValue}</Text>
    </div>
  );
};
