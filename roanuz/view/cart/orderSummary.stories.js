import React from 'react';
import CartData from '@/stories/sample-data/cart.json';
import { parseCart } from './model';
import { OrderSummaryModalView } from './orderSummaryModal';

export default {
  title: 'View / Cart / Order Summary Modal View',
  component: OrderSummaryModalView,
};

const Template = (args) => (
  <div>
    <OrderSummaryModalView
      {...args}
    />
  </div>
);

export const Normal = Template.bind({});
Normal.args = {
  cart: parseCart(CartData.data.cart),
};
