import React from 'react';
import { RZBrandsBarView } from './brandsBar';

export default {
  title: 'RZ / View / Brands Bar',
  component: RZBrandsBarView,
};

const Template = () => (
  <RZBrandsBarView />
);

export const Brands = Template.bind({});
Brands.args = {
  user: {},
};
