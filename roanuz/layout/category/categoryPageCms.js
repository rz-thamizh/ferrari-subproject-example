import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';

const CategoryPageCmsLayoutWrapper = styled.div`
  >.page-title {
    margin-top: ${asRem(30)};
    margin-bottom: ${asRem(30)};
  }
  >.page-breadcrumb {
    margin-top: ${asRem(12)};
  }
  >.page-widgets-section {
    margin-bottom: ${asRem(30)};
  }
  >.page-category-section {
    >.section-content {
      padding-top: ${asRem(20)};

      >.page-content-widgets-section {
        margin-bottom: ${asRem(20)};
      }
    }
  }
`;

export const CategoryPageCmsLayout = ({
  className,
  breadcrumb,
  title,
  top,
  topWidgets,
  bottomWidgets,
  content,
}) => {
  return (
    <CategoryPageCmsLayoutWrapper className={className}>
      {breadcrumb && (
        <div className="page-breadcrumb">{breadcrumb}</div>
      )}
      <div className="page-title">
        {title}
      </div>
      {top && (
        <div className="page-section page-widgets-section">{top}</div>
      )}
      {topWidgets && (
        <div className="page-section page-widgets-section">{topWidgets}</div>
      )}
      <div className="page-section page-category-section">
        <div className="section-content">
          <div className="page-content-section">{content}</div>
        </div>
      </div>
      {bottomWidgets && (
        <div className="page-section page-widgets-section">{bottomWidgets}</div>
      )}
    </CategoryPageCmsLayoutWrapper>
  );
};

CategoryPageCmsLayout.propTypes = {
  className: PropTypes.string,
  breadcrumb: PropTypes.element,
  title: PropTypes.element.isRequired,
  top: PropTypes.element,
  topWidgets: PropTypes.element,
  bottomWidgets: PropTypes.element,
  content: PropTypes.element,
};
