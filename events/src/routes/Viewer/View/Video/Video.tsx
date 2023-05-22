import cx from 'classnames';
import { useEffect, useRef } from 'react';

import styles from './Video.module.scss';

type VideoProps = {
  disableVideo: boolean;
  mediaStream: MediaStream;
};

export const Video = ({ disableVideo, mediaStream }: VideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    videoRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  return (
    <div className={styles.wrapper}>
      <video
        data-testid="videoTag"
        ref={videoRef}
        className={cx(styles.video, disableVideo && styles.hidden)}
        muted
        autoPlay
        playsInline
      />
    </div>
  );
};
