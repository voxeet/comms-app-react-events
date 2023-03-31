import Text from '@components/Text';
import { Button, IconButton } from '@dolbyio/comms-uikit-react';
import cx from 'classnames';
import { ReactNode } from 'react';

import styles from './OnboardingTooltip.module.scss';

function getTooltipTransform(position: OnboardingTooltipProps['position'], offset: number) {
  if (position === 'none') {
    return undefined;
  }

  if (position === 'bottom' || position === 'top') {
    return `translateX(${offset}px) translateX(-50%)`;
  }

  return `translateY(${offset}px) translateY(-50%)`;
}

export type OnboardingTooltipProps = {
  /** Where the tooltip should be relative to the element it is attached to. For example, if the tooltip should be below the element, use `bottom`. If this is set to `none`, an arrow will not be displayed. */
  position?: 'none' | 'top' | 'right' | 'bottom' | 'left';
  /** Offset of the tooltip body (in pixels). Use this to position the tooltip body relative to the arrow. Has no effect if `position` is `none`. */
  offset?: number;
  /** Text to display at the top of the tooltip */
  headerLabel: string;
  /** Text to display for the primary action button */
  primaryActionLabel: string;
  /** Text to display for the secondary action button */
  secondaryActionLabel: string;
  /** The current step */
  step: number;
  /** Total number of steps */
  totalSteps: number;
  /** Callback to execute when the close button is clicked */
  onCloseClick: () => void;
  /** Callback to execute when the primary action button is clicked */
  onPrimaryActionClick: () => void;
  /** Callback to execute when the secondary action button is clicked */
  onSecondaryActionClick: () => void;
  children: ReactNode;
};

export const OnboardingTooltip = ({
  position = 'none',
  offset = 0,
  headerLabel,
  primaryActionLabel,
  secondaryActionLabel,
  step,
  totalSteps,
  onCloseClick,
  onPrimaryActionClick,
  onSecondaryActionClick,
  children,
}: OnboardingTooltipProps) => {
  return (
    <div
      className={cx(
        styles.wrapper,
        position === 'top' && styles.top,
        position === 'bottom' && styles.bottom,
        position === 'left' && styles.left,
        position === 'right' && styles.right,
      )}
    >
      {position !== 'none' && (
        <div
          className={cx(
            styles.arrow,
            position === 'top' && styles.top,
            position === 'bottom' && styles.bottom,
            position === 'left' && styles.left,
            position === 'right' && styles.right,
          )}
        />
      )}
      <div className={styles.tooltip} style={{ transform: getTooltipTransform(position, offset) }}>
        <div className={styles.close}>
          <IconButton backgroundColor="white" iconColor="grey.300" size="xs" icon="close" onClick={onCloseClick} />
        </div>
        <Text color="black" type="h6">
          {headerLabel}
        </Text>
        <div className={styles.body}>
          <Text color="grey.500" type="paragraphExtraSmall">
            {children}
          </Text>
        </div>
        <div className={styles.footer}>
          <Text color="grey.500" type="paragraphExtraSmall">
            {step} of {totalSteps}
          </Text>
          <div className={styles.cta}>
            <button type="button" className={styles.secondaryAction} onClick={onSecondaryActionClick}>
              <Text color="primary.400">{secondaryActionLabel}</Text>
            </button>
            <Button variant="secondary" size="s" onClick={onPrimaryActionClick}>
              {primaryActionLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
