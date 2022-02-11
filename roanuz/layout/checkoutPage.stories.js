import React from 'react';
import { Blueprint } from '@/roanuz/view/blueprint';
import { CheckoutPageLayout } from './checkoutPage';

export default {
  title: 'Layout / Checkout Page',
  component: CheckoutPageLayout,
};

const Template = (args) => (
  <CheckoutPageLayout
    title={<Blueprint name="Title" color="#00c1fc" />}
    titleLinksLeft={<Blueprint name="Links Left" color="#eedd00" />}
    titleLinksRight={<Blueprint name="Links Right" color="#eefc00" />}
    content={<Blueprint name="Content" />}
    coupon={<Blueprint name="Coupon" />}
    cartPreview={<Blueprint name="Cart Preview" />}
    shippingPreview={<Blueprint name="Shipping Preview" />}
    widgets={<Blueprint name="Widgets" color="#ccaa00" />}
    {...args}
  />
);

export const View = Template.bind({});
View.args = {
};
