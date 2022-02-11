import React from 'react';
import PropTypes from 'prop-types';
import { SweetSlider } from './sweetSlider';
import { Display30 } from '../../typopgraphy';

export default {
  title: 'View / Sweet Slider',
  component: SweetSlider,
};

const colors = [
  '#48BF3E',
  '#349BF8',
  '#7CDBB2',
  '#7FEF1E',
  '#C5DE00',
  '#B6CEF7',
  '#E5AEA6',
];

function range(count) {
  const items = [];
  for (let i = 0; i < count; i += 1) {
    items.push({
      key: `${i}`,
      color: colors[i % colors.length],
    });
  }
  return items;
}

const TextItem = ({ color, children }) => {
  return (
    <div
      style={{
        background: color,
        padding: '40px',
        height: '220px',
        minWidth: '280px',
        textAlign: 'center',
      }}
    >
      <Display30>
        {children}
      </Display30>
    </div>
  );
};

TextItem.propTypes = {
  color: PropTypes.string,
  children: PropTypes.element.isRequired,
};

const Template = ({ ...props }) => (
  <div
    style={{
    }}
  >
    <SweetSlider {...props} />
  </div>
);

Template.propTypes = {};

const items = range(17).map((item) => (
  <TextItem
    key={item.key}
    color={item.color}
  >
    {item.key}
  </TextItem>
));

export const Simple = Template.bind();
Simple.args = {
  items,
};

export const Full = Template.bind();
Full.args = {
  responsive: { xs: { columns: 1 } },
  items,
};

export const TwoAuto = Template.bind();
TwoAuto.args = {
  responsive: { xs: { columns: 0 }, md: { columns: 2 } },
  items,
};

export const Complex = Template.bind();
Complex.args = {
  responsive: {
    xs: { columns: 0 },
    sm: { columns: 1, space: '25px', showPageArrows: false, showPageDots: true },
    md: { columns: 2, space: '0px', showPageArrows: true, showPageDots: false },
    lg: { columns: 3, space: '30px' },
  },
  items,
};

export const Three = Template.bind();
Three.args = {
  responsive: {
    xs: { columns: 3, space: '25px' },
  },
  items: items.slice(0, 3),
};
