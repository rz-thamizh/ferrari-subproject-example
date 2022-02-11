import React, { useState } from 'react';
import Products from '@/stories/sample-data/products.json';
import { AddToCartView } from '@/roanuz/view/product/addToCart';
import { AddToWishListView } from '@/roanuz/view/product/addToWishList';
import { ProductCardView } from './product';
import styled from 'styled-components';

export default {
  title: 'View / Product States',
  component: AddToCartView,
  argTypes: { onClick: { action: 'clicked' } },
};

export const Normal = () => (
  <AddToCartView
    loading={false}
    error={null}
    data={null}
  />
);

export const Loading = () => (
  <AddToCartView
    loading
    error={null}
    data={null}
  />
);

export const Error = () => (
  <AddToCartView
    loading={false}
    error={{ message: 'Something wrong!' }}
    data={null}
  />
);

export const Done = () => (
  <AddToCartView
    loading={false}
    error={null}
    data={{ good: true }}
  />
);

export const Disabled = () => (
  <AddToCartView
    loading={false}
    error={null}
    data={null}
    disabled
  />
);

const AllWrapper = styled.div`
  > div {
    padding: 10px;
    border-bottom: 1px solid;
  }
`;

export const All = () => (
  <AllWrapper>
    <div>
      {Normal()}
    </div>
    <div>
      {Loading()}
    </div>
    <div>
      {Error()}
    </div>
    <div>
      {Done()}
    </div>
    <div>
      {Disabled()}
    </div>
  </AllWrapper>
);
