import React, { useState, useEffect } from 'react';
import { times } from 'lodash';

import config from 'data/config';

import style from './index.module.scss';

const MIN_PEGS = 50;

export default function Wheel ({
  choices = []
}) {

  const {
    colors
  } = config;

  const [ colorOffset, setColorOffset ] = useState(0);

  const pegCount = Math.ceil(MIN_PEGS / choices.length) * choices.length;

  useEffect(() => {
    setColorOffset(Math.floor(Math.random() * colors.length))
  }, [
    choices?.length,
    colors?.length
  ])

  function getPercXY(perc) {
    return [
      Math.cos(2 * Math.PI * perc),
      Math.sin(2 * Math.PI * perc)
    ];
  }

  function getColor(index) {
    return colors[(index + colorOffset) % colors.length];
  }

  function renderSlice(choice, index) {

    const percPer   = 1 / choices.length,
          percStart = percPer * index,
          percEnd   = percPer * (index + 1);

    const [ startX, startY ] = getPercXY(percStart);
    const [ endX, endY ]     = getPercXY(percEnd);

    return (
      <path
        key={index}
        d={`M ${startX} ${startY} A 1 1 0 ${(choices.length > 1) ? 0 : 1} 1 ${endX} ${endY} L 0 0`}
        fill={getColor(index)} />
    )

  }

  function renderPeg(index) {

    const [ x, y ] = getPercXY(index / pegCount);

    return (
      <circle
        cx={x}
        cy={y}
        r='0.015' />
    );

  }

  return (
    <div className={style.wrap}>

      <svg
        viewBox={`-1.1 -1.1 2.2 2.2`}>

        <g className={style.wrapWheel}>
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

      </svg>

      <ul>
        {choices.map((c, i) => (
          <li key={i}>
            {c}
          </li>
        ))}
      </ul>

    </div>
  )

}
