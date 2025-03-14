import React, {
  useState,
  useEffect
} from 'react';
import { motion } from 'motion/react';
import { shuffle } from 'lodash';
import config from 'data/config';
import tickAudio from 'audio/tick.wav';

import style from './index.module.scss';
import { random } from 'varyd-utils';
import { useInterval } from 'react-use';
import classNames from 'classnames';

export default function Wheel ({
  choices = []
}) {

  const [colors, setColors] = useState([]);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  const choiceCount = choices?.length || 0;

  useInterval(
    () => {
      shuffleColors();
    },
    isDemoMode ? 250 : null
  );

  useEffect(() => {
    shuffleColors();
  }, []);

  const shuffleColors = () => {
    setColors(
      shuffle(config.colors)
    );
  }

  const resetDemoMode = () => {
    setIsDemoMode(false);
    setTimeout(() => {
      setIsDemoMode(true);
    }, 30000);
  }

  const handleSpinClick = () => {
    const index = random.index(choices);
    const angle = index * (360 / choiceCount);
    const spins = random.int(10, 15);
    const normRotation = rotation - (rotation % 360);
    const targetRotation = normRotation + angle + (spins * 360);

    setRotation(targetRotation);
    resetDemoMode();
  }

  const handleRotationUpdate = ({ rotate }) => {
    const index = getChoiceIndexFromAngle(rotate);

    if (index !== prevIndex) {
      playTick();
    }

    setPrevIndex(index);
  };

  const playTick = () => {
    const tick = new Audio(tickAudio);
    tick.volume = config.tickVolume;
    tick.play();
  }

  const getCircleXY = (perc) => {
    return [
      Math.cos(2 * Math.PI * perc),
      Math.sin(2 * Math.PI * perc)
    ];
  }

  const getChoiceIndexFromAngle = (angle) => {
    const perc = ((angle / 360) + (1 / (2 * choiceCount))) % 1;
    const index = Math.floor(perc * choiceCount);
    return index;
  }

  const getSlicePathDef = (index) => {
    const isOdd = (choiceCount % 2 === 1);
    const percOffset = isOdd ? 0 : 0.5 / choiceCount;

    const percPer = 1 / choiceCount;
    const percStart = percOffset + (percPer * index);
    const percEnd = percOffset + (percPer * (index + 1));

    const [ startX, startY ] = getCircleXY(percStart);
    const [ endX, endY ] = getCircleXY(percEnd);

    return `M ${startX} ${startY} A 1 1 0 ${(choiceCount > 1) ? 0 : 1} 1 ${endX} ${endY} L 0 0`;
  }

  const renderSlice = (choice, index) => {
    const color = colors[index % colors.length];
    const pathDef = getSlicePathDef(index);

    return (
      <path
        key={index}
        d={pathDef}
        fill={color} />
    );
  }
  const renderSliceLabel = (choice, index) => {
    const labelTurn = 0.5 + ((choiceCount - index) / choiceCount);

    return (
      <text
        key={index}
        x="0"
        y="0"
        style={{
          transform: `rotate(${labelTurn}turn) translate(-0.905px, 0.025px)`
        }}>
        {choice}
      </text>
    );
  }

  const renderSliceOutline = (choice, index) => {
    const pathDef = getSlicePathDef(index);

    return (
      <path
        key={index}
        d={pathDef} />
    );
  }

  return (
    <div className={classNames({
      [style.wrap]: true,
      [style.isDemoMode]: isDemoMode
    })}>

      <svg viewBox={`-1.1 -1.1 2.2 2.2`}>

        <defs>
          <mask id="center-hole">
            <circle cx="0" cy="0" r={2} fill="white" />
            <circle cx="0" cy="0" r={config.centerRadius} fill="black" />
          </mask>
        </defs>

        <motion.g
          mask="url(#center-hole)"
          className={style.wrapWheel}
          animate={{
            rotate: rotation
          }}
          transition={{
            type: 'inertia',
            timeConstant: 1000,
            modifyTarget: () => rotation
          }}
          onUpdate={handleRotationUpdate}>
          <g className={style.slices}>
            {choices.map(renderSlice)}
          </g>
          <g className={style.labels}>
            {choices.map(renderSliceLabel)}
          </g>
          <g className={style.outlines}>
            {choices.map(renderSliceOutline)}
          </g>
          <circle
            className={style.centerOutline}
            cx="0"
            cy="0"
            r={config.centerRadius} />
        </motion.g>

        <polygon
          className={style.flapper}
          points="-1.1,-0.05 -1.1,0.05 -0.95,0" />

      </svg>

      <button
        onClick={handleSpinClick}>
        Spin the wheel
      </button>

    </div>
  )

}
