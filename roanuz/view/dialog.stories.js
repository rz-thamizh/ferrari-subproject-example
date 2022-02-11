import React, { useState } from 'react';
import { DailogView } from './dialog';

export default {
  title: 'View / Dialog',
  component: DailogView,
};

export const Simple = () => {
  return (
    <DailogView
      titleText="Confirm this"
      showClose
      onClose={() => {}}
      confirmText="Yes, Delete"
      onConfirm={() => {}}
      show
      containerWidth="320px"
    >
      <h1>Are you sure want to delete this?</h1>
    </DailogView>
  );
};

export const Bigger = () => {
  const items = Array.apply(null, { length: 40 }).map((e, i) => i);
  const cols = Array.apply(null, { length: 10 }).map((e, i) => i);
  return (
    <DailogView
      titleText="Confirm this and this is very long text. You know It could so big."
      showClose
      onClose={() => {}}
      confirmText="Yes, Delete"
      onConfirm={() => {}}
      show
    >
      <h1>Are you sure want to delete this?</h1>
      <table>
        {items.map((i) => (
          <tr key={i}>
            {cols.map((j) => (
              <td key={j}>
                Hello
                {' '}
                {i}
                {'-'}
                {j}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </DailogView>
  );
};

export const OnClickEvent = () => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <DailogView
        titleText="Confirm this"
        showClose
        confirmText="Yes, Delete"
        show={show}
        onClose={() => setShow(false)}
        onConfirm={() => setShow(false)}
      >
        <h1>Are you sure want to delete this?</h1>
      </DailogView>

      <button
        onClick={() => { setShow(true); }}
        type="button"
      >
        Show
      </button>
    </div>
  );
};
