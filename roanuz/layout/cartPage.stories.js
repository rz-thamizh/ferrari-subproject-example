import React from 'react';
import { Blueprint } from '@/roanuz/view/blueprint';
import { CartPageLayout } from './cartPage';

export default {
  title: 'Layout / Shopping Cart Page',
  component: CartPageLayout,
};

const Template = (args) => (
  <CartPageLayout
    title={<Blueprint name="Title" color="#00c1fc" />}
    titleLinksRight={<Blueprint name="Links Right" color="#eefc00" />}
    content={<Blueprint name="Content" />}
    coupon={<Blueprint name="Coupon" />}
    cartPreview={<Blueprint name="Cart Preview" />}
    shippingPreview={<Blueprint name="Shipping Preview" />}
    {...args}
  />
);

export const View = Template.bind({});
View.args = {
};
