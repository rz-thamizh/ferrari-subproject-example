import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';

const CategoryPageLayoutWrapper = styled.div`
  >.page-title {
    margin-top: ${asRem(30)};
    margin-bottom: ${asRem(20)};
  }
  >.page-breadcrumb {
    margin-top: ${asRem(12)};
  }
  >.page-widgets-section {
    margin-bottom: ${asRem(30)};
  }
  >.page-content-section {
  }
`;

export const CategoryPageLayout = ({
  className,
  breadcrumb,
  title,
  topContent,
  bottomContent,
  content,
}) => {
  return (
    <CategoryPageLayoutWrapper className={className}>
      {breadcrumb && (
        <div className="page-breadcrumb">{breadcrumb}</div>
      )}
      <div className="page-title">
        {title}
      </div>
      {topContent && (
        <div className="page-section page-widgets-section">{topContent}</div>
      )}
      {content && (
        <div className="page-section page-content-section">{content}</div>
      )}
      {bottomContent && (
        <div className="page-section page-widgets-section">{bottomContent}</div>
      )}
    </CategoryPageLayoutWrapper>
  );
};

CategoryPageLayout.propTypes = {
  className: PropTypes.string,
  breadcrumb: PropTypes.element,
  title: PropTypes.element.isRequired,
  topContent: PropTypes.element,
  bottomContent: PropTypes.element,
  content: PropTypes.element,
};
