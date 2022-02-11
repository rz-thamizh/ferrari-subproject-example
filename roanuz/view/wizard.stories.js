import React from 'react';
import { WizardProgressView } from './wizard';

export default {
  title: 'View / WizardProgress',
  component: WizardProgressView,
};

const Template = (args) => (
  <WizardProgressView {...args} />
);

export const Normal = Template.bind({});
Normal.args = {
  items: [
    {
      text: 'Afhending',
      href: '/checkout/step1',
      alt: 'Goto Step 1',
      future: false,
      completed: true,
    },
    {
      text: 'Yfirlit og greiðsla',
      href: '/checkout/step2',
      alt: 'Goto Step 1',
      future: false,
      completed: false,
    },
    {
      text: 'Thank You',
      href: '/checkout/step3',
      alt: 'Goto Step 3',
      future: true,
      completed: false,
    },
  ],
};
