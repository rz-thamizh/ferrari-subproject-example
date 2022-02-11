import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';

const CategoryAutoContentLayoutWrapper = styled.div`
  .page-content-image-section,
  .page-content-widgets-section,
  .page-content-section,
  .page-section-auto-menu {
    margin-bottom: ${asRem(10)};
  }

  .page-content-section {
    .rz-magento-html {
      img {
        max-width: 100%;
      }
    }
  }

  .page-section-auto-menu {
    margin-top: ${asRem(60)};
    margin-bottom: ${asRem(60)};
  }
`;

export const CategoryAutoContentLayout = ({
  imageContent,
  contentTopWidgets,
  contentBottomWidgets,
  content,
  tree,
  featuredCategories,
}) => {
  return (
    <CategoryAutoContentLayoutWrapper>
      {imageContent && (
        <div className="page-content-image-section">{imageContent}</div>
      )}
      {contentTopWidgets && (
        <div className="page-content-widgets-section">{contentTopWidgets}</div>
      )}
      {content && (
        <div className="page-content-section">{content}</div>
      )}
      {tree && (
        <div className="page-section page-section-auto-menu">
          {tree}
        </div>
      )}
      {featuredCategories && featuredCategories.length && (
        <div className="page-section page-section-featured-products">
          {featuredCategories.map((ele) => ele)}
        </div>
      )}
      {contentBottomWidgets && (
        <div className="page-content-widgets-section bottom">{contentBottomWidgets}</div>
      )}
    </CategoryAutoContentLayoutWrapper>
  );
};

CategoryAutoContentLayout.propTypes = {
  imageContent: PropTypes.element,
  contentTopWidgets: PropTypes.element,
  contentBottomWidgets: PropTypes.element,
  content: PropTypes.element,
  tree: PropTypes.element,
  featuredCategories: PropTypes.arrayOf(PropTypes.element),
};
