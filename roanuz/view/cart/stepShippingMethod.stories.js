import React from 'react';
import CartData from '@/stories/sample-data/cart.json';
import CartEmptyData from '@/stories/sample-data/cartEmpty.json';
import { parseCart } from './model';
import { StepShippingMethodView } from './stepShippingMethod';

export default {
  title: 'View / Cart / Step Shipping',
  component: StepShippingMethodView,
};

const Template = (args) => (
  <div
    style={{ width: '572px', margin: '30px' }}
  >
    <StepShippingMethodView
      {...args}
    />
  </div>
);

export const Normal = Template.bind({});
Normal.args = {
  cart: parseCart(CartData.data.cart),
};

export const Empty = Template.bind({});
Empty.args = {
  cart: parseCart(CartEmptyData.data.cart),
};
