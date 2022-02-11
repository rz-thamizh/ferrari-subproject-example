import React from 'react';
import CategoryTreeData from '@/stories/sample-data/categoryTree.json';
import { CategoryTreeView } from './tree';

export default {
  title: 'View / Category / Tree',
  component: CategoryTreeView,
};

const Template = (args) => (
  <CategoryTreeView
    {...args}
  />
);

export const View = Template.bind({});
View.args = {
  tree: CategoryTreeData.data.categories.items,
  showImages: true,
};

export const NoImages = Template.bind({});
NoImages.args = {
  tree: CategoryTreeData.data.categories.items,
  showImages: false,
};
