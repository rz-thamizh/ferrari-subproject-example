import React from 'react';
import { RZAnnouncementBar } from './announcement';

export default {
  title: 'RZ / View / Announcement Bar',
  component: RZAnnouncementBar,
};

const Template = () => <RZAnnouncementBar />;

export const Brands = Template.bind({});
Brands.args = {
  user: {},
};
