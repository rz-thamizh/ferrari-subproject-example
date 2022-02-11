import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

export const CmsHtml = ({ html }) => {
  const node = ReactHtmlParser(html);
  return (
    <div className="rz-magento-html">
      {node}
    </div>
  );
};

CmsHtml.propTypes = {
  html: PropTypes.string,
};
