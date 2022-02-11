import React from 'react';
import { Blueprint } from '@/roanuz/view/blueprint';
import { ProductPageLayout } from './page';

export default {
  title: 'Layout / Product Page',
  component: ProductPageLayout,
};

const Template = (args) => (
  <ProductPageLayout
    {...args}
    breadcrumb={<Blueprint name="Breadcrumb" color="#00c1fc" />}
    title={<Blueprint name="Title" color="#eedd00" />}
    gallery={<Blueprint name="Gallery" color="#eefc00" />}
    desc={<Blueprint name="Desc" />}
    sidebar={<Blueprint name="Sidebar" />}
    details={<Blueprint name="Details" />}
    widgets={<Blueprint name="widgets" />}
  />
);

export const Normal = Template.bind({});
Normal.args = {
};

export const WithNotice = Template.bind({});
WithNotice.args = {
  notice: (<Blueprint name="Notice" />),
  titleRight: (<Blueprint name="Right" />),
};
