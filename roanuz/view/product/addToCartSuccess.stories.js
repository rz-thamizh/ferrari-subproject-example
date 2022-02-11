import React from 'react';
import Products from '@/stories/sample-data/productList.json';
import { parseProduct } from '@/roanuz/view/product/model';
import { AddToCartSuccessView } from './addToCartSuccess';

export default {
  title: 'View / Product / Add To Cart Success Modal',
  component: AddToCartSuccessView,
};

const Template = (args) => (
  <AddToCartSuccessView
    show
    {...args}
  />
);

const products = Products.data.products.items;

export const AddToCartSuccess = Template.bind({});
AddToCartSuccess.args = {
  products: [parseProduct(products[0])],
};
