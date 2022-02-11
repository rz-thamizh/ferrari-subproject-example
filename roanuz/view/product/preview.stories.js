import React from 'react';
import Products from '@/stories/sample-data/productList.json';
import { parseProduct } from '@/roanuz/view/product/model';
import { ProductPreviewDisplayMode } from '@/roanuz/layout/product/preview';
import { ProductPreviewView } from './preview';

export default {
  title: 'View / Product Preview',
  component: ProductPreviewView,
};

const Template = (args) => {
  if (args.width) {
    return (
      <div style={{ width: args.width }}>
        <ProductPreviewView
          {...args}
        />
      </div>
    );
  }
  return (
    <ProductPreviewView
      {...args}
    />
  );
};

const products = Products.data.products.items;

export const ThreeColumnFlex = Template.bind({});
ThreeColumnFlex.args = {
  product: parseProduct(products[0]),
};

export const ThreeColumn = Template.bind({});
ThreeColumn.args = {
  product: parseProduct(products[0]),
  width: '400px',
};

export const TwoColumn = Template.bind({});
TwoColumn.args = {
  product: parseProduct(products[0]),
  width: '380px',
  displayMode: ProductPreviewDisplayMode.TwoCol,
};
