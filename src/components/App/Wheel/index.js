import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import { times, shuffle } from 'lodash';
import useAnimationFrame from 'use-animation-frame';
import { random } from 'varyd-utils';

import config from 'data/config';
import tickAudio from 'audio/tick.wav';

import style from './index.module.scss';

const MIN_PEGS = 25;

export default function Wheel ({
  choices = []
}) {

  const [ colors, setColors ] = useState([]);
  const [ rotation, setRotation ] = useState(0);
  const [ spinVel, setSpinVel ] = useState(0);
  const [ spinAcc, setSpinAcc ] = useState(0);
  const [ selectedIndex, setSelectedIndex ] = useState(0);

  const choiceCount = choices?.length || 0,
        pegCount    = Math.ceil(MIN_PEGS / choiceCount) * choiceCount,
        pegPerc     = 1 / pegCount;

  useEffect(() => {
    setColors(shuffle(config.colors));
  }, [ ]);

  useAnimationFrame((e) => {
    if (spinAcc !== 0) {
      const trgtSpinVel = Math.min(1, spinVel + spinAcc);
      setSpinVel(trgtSpinVel);
      if (trgtSpinVel >= 1) {
        holdSpin();
      } else if (trgtSpinVel <= 0) {
        endSpin();
      }
    } else if (spinVel > 0) {
      if (Math.random() < 0.025) {
        slowSpin();
      }
    }
    if (spinVel > 0) {
      const deltaR = Math.pow(spinVel / 4, 3);
      const trgtRotation = (rotation + deltaR) % 1;

      if ((deltaR >= pegPerc) || ((rotation % pegPerc) > (trgtRotation % pegPerc))) {
        playTick();
      }

      setSelectedIndex(Math.floor((1 - trgtRotation) * choiceCount))

      setRotation(trgtRotation);
    }
  });

  function onSpinClick() {
    startSpin();
  }

  function onSpinVelChange(e) {
    setSpinVel(e.target.value / 100);
  }

  function startSpin() {
    const nextSpinAcc = random.num(0.005, 0.02);
    setSpinAcc(nextSpinAcc);
  }
  function holdSpin() {
    setSpinVel(1);
    setSpinAcc(0);
  }
  function slowSpin() {
    setSpinAcc(-0.0015);
  }
  function endSpin() {
    setSpinAcc(0);
    setSpinVel(0);
  }

  function playTick() {
    const tick = new Audio(tickAudio);
    tick.play();
  }

  function getCircleXY(perc) {
    return [
      Math.cos(2 * Math.PI * perc),
      Math.sin(2 * Math.PI * perc)
    ];
  }

  function renderSlice(choice, index) {

    const percPer   = 1 / choiceCount,
          percStart = percPer * index,
          percEnd   = percPer * (index + 1);

    const [ startX, startY ] = getCircleXY(percStart);
    const [ endX, endY ]     = getCircleXY(percEnd);

    const color = (index === selectedIndex)
      ? 'white'
      : colors[index % colors.length];

    return (
      <path
        key={index}
        d={`M ${startX} ${startY} A 1 1 0 ${(choiceCount > 1) ? 0 : 1} 1 ${endX} ${endY} L 0 0`}
        fill={color} />
    )

  }

  function renderPeg(index) {

    const [ x, y ] = getCircleXY(index / pegCount);

    return (
      <circle
        key={`peg-${index}`}
        cx={x}
        cy={y}
        r='0.015' />
    );

  }

  return (
    <div className={style.wrap}>

      <p>
        <svg viewBox={`-1.1 -1.1 2.2 2.2`}>

          <g
            className={style.wrapWheel}
            style={{
              transform: `rotate(${rotation}turn)`
            }}>
            <g className={style.slices}>
              {choices.map(renderSlice)}
            </g>
            <g className={style.pegs}>
              {times(pegCount, renderPeg)}
            </g>
          </g>

          <circle
            className={style.center}
            cx='0'
            cy='0'
            r='0.25' />

          <polygon
            className={style.flapper}
            points='1.075,-0.05 1.075,0.05 0.95,0' />

        </svg>
      </p>

      <p>
        <button
          onClick={onSpinClick}>
          Spin
        </button>
        <input
          type='range'
          value={spinVel * 100}
          onChange={onSpinVelChange} />
      </p>
      <p>
        Selected: {selectedIndex}
      </p>

    </div>
  )

}
