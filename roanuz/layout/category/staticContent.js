import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CategoryStaticContentLayoutWrapper = styled.div`
`;

export const CategoryStaticContentLayout = ({
  imageContent,
  contentTopWidgets,
  contentBottomWidgets,
  content,
}) => {
  return (
    <CategoryStaticContentLayoutWrapper>
      {imageContent && (
        <div className="page-content-image-section">{imageContent}</div>
      )}
      {contentTopWidgets && (
        <div className="page-content-widgets-section">{contentTopWidgets}</div>
      )}
      <div className="page-content-section">{content}</div>
      {contentBottomWidgets && (
        <div className="page-content-widgets-section bottom">{contentBottomWidgets}</div>
      )}
    </CategoryStaticContentLayoutWrapper>
  );
};

CategoryStaticContentLayout.propTypes = {
  imageContent: PropTypes.element,
  contentTopWidgets: PropTypes.element,
  contentBottomWidgets: PropTypes.element,
  content: PropTypes.element,
};
