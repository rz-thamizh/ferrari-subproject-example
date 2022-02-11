import React from 'react';
import { FooterView } from '@/roanuz/view/footer/footer';

export default {
  title: 'RZ / View / Footer',
  component: FooterView,
};

const Template = () => <FooterView />;

export const Brands = Template.bind({});
Brands.args = {
  user: {},
};
