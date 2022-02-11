import React from 'react';
import { Blueprint } from '@/roanuz/view/blueprint';
import { ProductCardLayout, ProductCardDisplayMode } from './product';

export default {
  title: 'Layout / Product Card',
  component: ProductCardLayout,
};

const Template = (args) => (
  <ProductCardLayout
    image={<Blueprint name="Image" color="#00c1fc" />}
    imageOverlayTop={<Blueprint name="Top Overlay" color="#eedd00" />}
    imageOverlayBottom={<Blueprint name="Bottom Overlay" color="#eefc00" />}
    heading={<Blueprint name="Product Name" />}
    offer={<Blueprint name="Offer" />}
    price={<Blueprint name="Price" />}
    action={<Blueprint name="Action" />}
    {...args}
  />
);

export const OneBySix = Template.bind({});
OneBySix.args = {
  displayMode: null,
};

export const OneByThree = Template.bind({});
OneByThree.args = {
  displayMode: ProductCardDisplayMode.OneByThree,
};

export const OneByTwo = Template.bind({});
OneByThree.args = {
  displayMode: ProductCardDisplayMode.OneByTwo,
};
