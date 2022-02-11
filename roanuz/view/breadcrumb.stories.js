import React from 'react';
import { BreadcrumbView } from './breadcrumb';

export default {
  title: 'View / Breadcrumb',
  component: BreadcrumbView,
};

const Template = (args) => (
  <BreadcrumbView {...args} />
);

export const Normal = Template.bind({});
Normal.args = {
  links: [
    { text: 'Heim', href: '/' },
    { text: 'Skjáir og Skjávarpar', href: '/cat1' },
    { text: 'Tölvuskjáir', href: '/cat1/cate2' },
    { text: 'AOC Q27G2U 240Hz QHD leikjaskjár með HDR400 ', href: '/cat1/cate2/product', isActive: true },
  ],
};
