import React from 'react';
import PropTypes from 'prop-types';

const ErrorView = ({ error }) => {
  console.error(error);
  return (
    <div className="debug-error-view">
      <div className="debug-error-message">
        {error ? error.message : 'Error!'}
      </div>
    </div>
  );
};

ErrorView.propTypes = {
  error: PropTypes.object,
};

export default ErrorView;
