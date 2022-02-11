import React from 'react';
import CategoryTreeData from '@/stories/sample-data/categoryTree.json';
import { BrandCategoriesView } from './categories';

export default {
  title: 'View / Brand / Categories',
  component: BrandCategoriesView,
};

const Template = (args) => (
  <BrandCategoriesView
    {...args}
  />
);

const categories = [
  { id: 1, count: 10, name: 'TVs' },
  { id: 2, count: 4, name: 'QLED TVs' },
  { id: 3, count: 8, name: '4K Ultra HD TVs' },
  { id: 4, count: 500, name: 'Smart TVs' },
  { id: 5, count: 6, name: 'Sound Bars' },
  { id: 6, count: 1241, name: 'Tablets' },
  { id: 7, count: 400, name: 'Laptops' },
  { id: 8, count: 23, name: 'Monitors' },
  { id: 9, count: 2, name: 'Storage' },
  { id: 10, count: 41, name: 'Smartphones' },
  { id: 11, count: 890, name: 'Wearable Technology' },
  { id: 12, count: 1, name: 'Accessories' },
  { id: 13, count: 35, name: 'Solid State Drives' },
  { id: 14, count: 42, name: 'Portable SSD' },
  { id: 15, count: 13, name: 'Memory Cards' },
  { id: 16, count: 53, name: 'Refrigerators' },
  { id: 17, count: 85, name: 'USB Flash Drives' },
  { id: 18, count: 13, name: 'Refrigerators' },
  { id: 19, count: 7, name: 'Washers and Dryers' },
  { id: 20, count: 12, name: 'Ranges and Ovens' },
  { id: 21, count: 100, name: 'Dishwashers' },
];

export const View = Template.bind({});
View.args = {
  categories,
  brandUrlKey: 'lg',
  showImages: true,
};

export const Filled = Template.bind({});
Filled.args = {
  categories,
  brandUrlKey: 'lg',
  filledStyle: true,
};

export const FilledWithCount = Template.bind({});
FilledWithCount.args = {
  categories,
  brandUrlKey: 'lg',
  filledStyle: true,
  showCount: true,
};
