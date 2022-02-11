import React from 'react';
import PropTypes from 'prop-types';
import { CategoryPageView } from '@/roanuz/view/category/page';
import { CategoryAutoContentController } from './autoContent';
// import { CategoryProductsWithFilterController } from './productsWithFilter';
import { CategoryProductsWithFilterControllerV2 } from './filterv2/productsWithFilter';

export const CategoryPageController = ({
  category,
  widgets,
}) => {
  if (category.showAutoContent) {
    return (
      <CategoryAutoContentController
        category={category}
        widgets={widgets}
      />
    );
  }

  if (category.showProducts) {
    return (
      <CategoryProductsWithFilterControllerV2
        category={category}
        widgets={widgets}
      />
    );
  }

  return (
    <CategoryPageView
      category={category}
      widgets={widgets}
    />
  );
};

CategoryPageController.propTypes = {
  category: PropTypes.object.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
};
