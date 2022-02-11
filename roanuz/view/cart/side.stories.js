import React from 'react';
import CartData from '@/stories/sample-data/cart.json';
import { parseCart } from './model';
import { CartSideView } from './side';

export default {
  title: 'View / Cart / Side View',
  component: CartSideView,
};

const Template = (args) => (
  <div
    style={{ width: '380px', margin: '30px' }}
  >
    <CartSideView
      {...args}
    />
  </div>
);

export const Normal = Template.bind({});
Normal.args = {
  cart: parseCart(CartData.data.cart),
};

export const WithShipping = Template.bind({});
WithShipping.args = {
  cart: parseCart(CartData.data.cart),
  showShipping: true,
};
