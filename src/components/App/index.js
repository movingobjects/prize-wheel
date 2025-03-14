import React, { useState } from 'react';

import Wheel from './Wheel';

import config from 'data/config';

import style from './index.module.scss';

export default function App() {

  const [ inputText, setInputText ] = useState(config.defaultChoices.join('\n'));

  const choices = inputText
    .split('\n')
    .filter((c) => !!c.length);

  const handleInputChange = (e) => {
    setInputText(e.target.value || '')
  }

  return (
    <div className={style.wrap}>

      <main>

        <section className={style.wrapWheel}>
          <Wheel choices={choices} />
        </section>

        <section className={style.wrapInput}>
          <textarea
            value={inputText}
            onChange={handleInputChange} />
        </section>

      </main>

    </div>
  )

}
