import React, { useState } from 'react';

import Wheel from './Wheel';

import style from './index.module.scss';

export default function App() {

  const [ inputText, setInputText ] = useState('');

  const choices = inputText
    .split('\n')
    .filter((c) => !!c.length);

  function onInputChange(e) {
    setInputText(e.target.value || '')
  }

  return (
    <div className={style.wrap}>
      <h1>App</h1>

      <main>

        <section className={style.wrapWheel}>
          <Wheel
            choices={choices} />
        </section>

        <section className={style.wrapInput}>
          <textarea
            value={inputText}
            onChange={onInputChange} />
        </section>

      </main>

    </div>
  )

}
