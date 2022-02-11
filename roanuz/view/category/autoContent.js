import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CategoryAutoContentLayout } from '@/roanuz/layout/category/autoContent';
import { CategoryTreeView } from './tree';

const CategoryAutoContentViewWrapper = styled.div`
`;

export const CategoryAutoContentView = ({
  contentTopWidgets,
  contentBottomWidgets,
  imageView,
  cmsContentView,
  categoryTree,
  featuredCategories,
}) => {
  let tree = null;
  if (categoryTree) {
    tree = (
      <CategoryTreeView
        tree={categoryTree}
        showImages
      />
    );
  }

  return (
    <CategoryAutoContentViewWrapper>
      <CategoryAutoContentLayout
        imageContent={imageView}
        contentTopWidgets={contentTopWidgets}
        tree={tree}
        content={cmsContentView}
        contentBottomWidgets={contentBottomWidgets}
        featuredCategories={featuredCategories}
      />
    </CategoryAutoContentViewWrapper>
  );
};

CategoryAutoContentView.propTypes = {
  categoryTree: PropTypes.object,
  featuredCategories: PropTypes.arrayOf(PropTypes.object),
  contentTopWidgets: PropTypes.element,
  contentBottomWidgets: PropTypes.element,
  imageView: PropTypes.element,
  cmsContentView: PropTypes.element,
};
