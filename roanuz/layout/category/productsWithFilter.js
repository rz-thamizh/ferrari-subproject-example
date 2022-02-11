import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseCategoryProductsWithFilterLayoutWrapper = styled.div`
  border-top: 1px solid var(--color-disabled-3);
  display: flex;
  flex-direction: column-reverse;

  >.section-filter {
    padding: ${asRem(20)};
    padding-left: 0;
    display: none;

    @media screen and (min-width: ${Breakpoint.sm}) {
      display: block;
    }
  }

  >.section-content {
    padding-top: ${asRem(20)};
    >.page-content-widgets-section {
      margin-bottom: ${asRem(20)};
    }

    .category-banner-image {
      img { 
        width: 100%;
        object-fit: cover;
      }
      margin-bottom: ${asRem(20)};
    } 
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    flex-direction: row;
    >.section-filter {
      width: ${asRem(250)};
      min-width: ${asRem(250)};
      margin-right: ${asRem(20)};
      padding-right: ${asRem(20)};

      border-right: 1px solid var(--color-disabled-3);
    }

    >.section-content {
      flex: 1;
      .rz-products-grid {
        grid-template-columns: repeat(2,1fr);
      }
    }
  }

  @media screen and (min-width: ${Breakpoint.md}) {
    >.section-content {
      .rz-products-grid {
        grid-template-columns: repeat(3,1fr);
      }
    }
  }

  @media screen and (min-width: ${Breakpoint.lg}) {
    >.section-filter {
      margin-right: ${asRem(40)};
    }
    >.section-content {
      .rz-products-grid {
        grid-template-columns: repeat(4,1fr);
      }
    }
  }
`;

export const BaseCategoryProductsWithFilterLayout = ({
  imageView,
  contentTopWidgets,
  contentBottomWidgets,
  content,
  filter,
  mobileFilterView,
}) => {
  return (
    <CategoryProductsWithFilterLayoutWrapper>
      {mobileFilterView}
      <div className="section-filter">{filter}</div>
      <div className="section-content">
        {imageView && (
          <div className="page-content-image-section">{imageView}</div>
        )}
        {contentTopWidgets && (
          <div className="page-content-widgets-section">{contentTopWidgets}</div>
        )}
        <div className="page-content-section">{content}</div>
        {contentBottomWidgets && (
          <div className="page-content-widgets-section bottom">{contentBottomWidgets}</div>
        )}
      </div>
    </CategoryProductsWithFilterLayoutWrapper>
  );
};

BaseCategoryProductsWithFilterLayout.propTypes = {
  imageView: PropTypes.element,
  contentTopWidgets: PropTypes.element,
  contentBottomWidgets: PropTypes.element,
  content: PropTypes.element,
  filter: PropTypes.element,
  mobileFilterView: PropTypes.element,
};

export const CategoryProductsWithFilterLayoutWrapper = withDependencySupport(BaseCategoryProductsWithFilterLayoutWrapper, 'CategoryProductsWithFilterLayoutWrapper');
export const CategoryProductsWithFilterLayout = withDependencySupport(BaseCategoryProductsWithFilterLayout, 'CategoryProductsWithFilterLayout');
