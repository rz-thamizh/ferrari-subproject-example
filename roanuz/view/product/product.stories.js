import React, { useState } from 'react';
import Products from '@/stories/sample-data/products.json';
import { AddToCartView } from '@/roanuz/view/product/addToCart';
import { AddToWishListView } from '@/roanuz/view/product/addToWishList';
import { ProductCardDisplayMode } from '@/roanuz/layout/product/product';
import { parseProduct } from '@/roanuz/view/product/model';
import { ProductCardView } from './product';

export default {
  title: 'View / Product Card',
  component: ProductCardView,
};

const AC = ({ disabled }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const addItem = () => {
    console.log('Add item');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setData({ done: true });
    }, 1000);

    // setTimeout(() => {
    //   setLoading(false);
    //   setError({ message: 'Fail to add' });
    // }, 500);
  };
  return (
    <AddToCartView
      loading={loading}
      error={error}
      data={data}
      disabled={disabled}
      onClick={addItem}
    />
  );
};

const WL = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const addItem = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setData({ done: true });
    }, 1000);

    setTimeout(() => {
      setLoading(false);
      setError({ message: 'Fail to add' });
    }, 2500);
  };
  return (
    <AddToWishListView
      loading={loading}
      error={error}
      data={data}
      onClick={addItem}
    />
  );
};

const Template = (args) => (
  <ProductCardView
    {...args}
  />
);

const PreviewTemplate = (args) => (
  <ProductPreviewView
    {...args}
  />
);

export const Normal = Template.bind({});
Normal.args = {
  displayMode: null,
  addToCart: (<AC />),
  addToWishList: (<WL />),
  product: parseProduct(Products.data.products.items[0]),
};

export const Reburbished = Template.bind({});
Reburbished.args = {
  displayMode: null,
  addToCart: (<AC />),
  addToWishList: (<WL />),
  product: parseProduct(Products.data.products.items[1]),
};

export const OutOfStock = Template.bind({});
OutOfStock.args = {
  displayMode: null,
  addToCart: (<AC disabled />),
  product: parseProduct(Products.data.products.items[2]),
};

export const Large = Template.bind({});
Large.args = {
  displayMode: ProductCardDisplayMode.OneByThree,
  addToCart: (<AC />),
  addToWishList: (<WL />),
  product: parseProduct(Products.data.products.items[0]),
};

export const Box = Template.bind({});
Box.args = {
  displayMode: ProductCardDisplayMode.OneByTwo,
  addToCart: (<AC />),
  addToWishList: (<WL />),
  product: parseProduct(Products.data.products.items[0]),
};
