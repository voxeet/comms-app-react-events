import { Space, Tooltip } from '@dolbyio/comms-uikit-react';
import { useEffect, useState, useRef } from 'react';
import './RangeInput.module.scss';

type RangeInputProps = {
  minValue: number;
  maxValue: number;
  step?: number;
  value: number;
  callback: (value: number) => void;
} & React.ComponentProps<typeof Space>;

export const RangeInput = ({ minValue, maxValue, step = 1, value, callback }: RangeInputProps) => {
  const [sliderValue, setSliderValue] = useState(value || minValue);
  const ref = useRef<HTMLInputElement | null>(null);
  const [stepRange, setStep] = useState(minValue);

  useEffect(() => {
    if (ref.current) {
      const { offsetWidth, max } = ref.current;
      const calcStep = offsetWidth / +max;
      setStep(calcStep);
    }
  }, []);

  const getOffset =
    -(Math.ceil(maxValue / 2) - sliderValue) * stepRange - ((Math.ceil(maxValue / 2) - sliderValue) / maxValue) * 12;

  return (
    <Space fw>
      <Tooltip
        position="top"
        text={sliderValue.toString()}
        style={{ width: '100%' }}
        tooltipStyle={{
          transform: `translateX(${getOffset}px)`,
        }}
      >
        <input
          onChange={(event) => {
            const newVal = parseInt(event.target.value, 10);
            if (sliderValue !== newVal) {
              setSliderValue(newVal);
              callback(newVal);
            }
          }}
          type="range"
          id="range"
          min={minValue}
          max={maxValue}
          value={sliderValue}
          step={step}
          ref={ref}
        />
      </Tooltip>
    </Space>
  );
};
