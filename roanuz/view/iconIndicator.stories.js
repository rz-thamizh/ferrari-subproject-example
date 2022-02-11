import React, { useState } from 'react';
import { CartIndicatorView } from './cartIndicator';
import { WishListIndicatorView } from './wishListIndicator';

export default {
  title: 'View / Indicators',
  component: CartIndicatorView,
};

const Template = (args) => (
  <div
    style={{ width: '37px', height: '37px' }}
  >
    <CartIndicatorView {...args} />
  </div>
);

const WishListTemplate = (args) => (
  <div
    style={{ width: '37px', height: '37px' }}
  >
    <WishListIndicatorView {...args} />
  </div>
);

export const CartLoading = Template.bind({});
CartLoading.args = {
  cart: null,
  error: null,
  loading: true,
};

export const CartError = Template.bind({});
CartError.args = {
  cart: null,
  error: { message: 'Oops!' },
  loading: false,
};

export const CartCount = Template.bind({});
CartCount.args = {
  itemsCount: 99,
  error: null,
  loading: false,
};

export const WishListZero = WishListTemplate.bind({});
WishListZero.args = {
  itemsCount: 0,
  error: null,
  loading: false,
};

export const WishListCount = WishListTemplate.bind({});
WishListCount.args = {
  itemsCount: 99,
  error: null,
  loading: false,
};

export const CartStateChange = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState(null);

  setTimeout(() => {
    setCart(1);
    setLoading(false);
  }, 1000);

  setTimeout(() => {
    setError({ message: 'Failed' });
    setLoading(false);
  }, 2000);

  return (
    <div
      style={{ width: '37px', height: '37px' }}
    >
      <CartIndicatorView
        loading={loading}
        error={error}
        itemsCount={cart}
      />
    </div>
  );
};
