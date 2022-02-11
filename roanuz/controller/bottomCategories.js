import React from 'react';
import PropTypes from 'prop-types';
import { BottomCategoriesView } from '@/roanuz/view/bottomCategories';
import { LoadingView } from '@/roanuz/view/status';

export const BottomCategoriesController = ({ categoryTreeData }) => {
  const tree = categoryTreeData.categoryTree;
  if (!tree) return (<LoadingView />);
  const items = tree.categories.items
    .filter((x) => x.include_in_menu && x.product_count > 0)
    .sort((x, y) => x.position - y.position);

  return (
    <BottomCategoriesView items={items} />
  );
};

BottomCategoriesController.propTypes = {
  categoryTreeData: PropTypes.object.isRequired,
};
