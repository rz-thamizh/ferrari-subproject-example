import React from 'react';
import * as TG from './typopgraphy';

export default {
  title: 'Typopgraphy',
  component: TG.DisplayBold40,
};

const AllItems = {};
const Groups = {
  Title: [],
  Display: [],
  Text: [],
  All: [],
};
const DisplayOrder = [
  'Title',
  'Display',
  'Text',
  'All',
];

const render = (compId, text) => {
  const { comp } = AllItems[compId];
  const children = (
    <div>
      {text ?? compId}
    </div>
  );
  const newItem = React.createElement(comp, {
    key: compId,
  }, children);

  return newItem;
};

Object.keys(TG).sort().forEach((compId) => {
  if (compId.startsWith('Title')) {
    Groups.Title.push(compId);
  } else if (compId.startsWith('Display')) {
    Groups.Display.push(compId);
  } else if (compId.startsWith('Text')) {
    Groups.Text.push(compId);
  } else {
    Groups.All.push(compId);
  }
});

Object.keys(TG).forEach((compId) => {
  const comp = TG[compId];
  if (!comp.render) {
    return;
  }

  AllItems[compId] = { compId, comp };
});

export const All = () => (
  <div
    style={{ padding: '60px' }}
  >
    <TG.DisplayBold40>Typopgraphy</TG.DisplayBold40>
    <hr />
    <div>
      {DisplayOrder.map((group) => Groups[group].map((compId) => (
        <div style={{ paddingBottom: '20px' }}>
          {render(compId)}
        </div>
      )))}
    </div>
  </div>
);
