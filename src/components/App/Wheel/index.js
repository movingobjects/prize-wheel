import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import { TimelineLite } from 'gsap/all';
import { times, shuffle } from 'lodash';
import { random, maths } from 'varyd-utils';

import config from 'data/config';

import style from './index.module.scss';

const MIN_PEGS = 35;

export default function Wheel ({
  choices = []
}) {

  const wheelRef = useRef();

  const [ colors, setColors ] = useState([]);

  const pegCount = Math.ceil(MIN_PEGS / choices.length) * choices.length;

  useEffect(() => {
    setColors(shuffle(config.colors));
  }, [ ]);

  function onSpinClick() {

    const min      = 1,
          max      = 11,
          spin     = random.num(min, max),
          duration = maths.map(spin, min, max, 3, 6);

    const tl = new TimelineLite();

    tl
      .to(wheelRef.current, duration, {
        svgOrigin: '0 0',
        rotation: `+=${360 * spin}`,
        ease: 'expo.out',
        force3D: true,
      })
      .to(wheelRef.current, 0.5, {
        rotation: "+=2",
        ease: 'power0.none',
        force3D: true
      },"-=0.5");

  }

  function getCircleXY(perc) {
    return [
      Math.cos(2 * Math.PI * perc),
      Math.sin(2 * Math.PI * perc)
    ];
  }

  function renderSlice(choice, index) {

    const percPer   = 1 / choices.length,
          percStart = percPer * index,
          percEnd   = percPer * (index + 1);

    const [ startX, startY ] = getCircleXY(percStart);
    const [ endX, endY ]     = getCircleXY(percEnd);

    const color = colors[index % colors.length];

    return (
      <path
        key={index}
        d={`M ${startX} ${startY} A 1 1 0 ${(choices.length > 1) ? 0 : 1} 1 ${endX} ${endY} L 0 0`}
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
            ref={wheelRef}
            className={style.wrapWheel}>
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
        <button onClick={onSpinClick}>Spin</button>
      </p>

    </div>
  )

}
