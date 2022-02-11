import React from 'react';
import PropTypes from 'prop-types';

export const LoadingView = ({ message, style }) => (
  <div className="container">
    <div className="row">
      <div
        className="col-12 text-center"
        style={style || {
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {message || 'Hleð...'}
      </div>
    </div>
  </div>
);

LoadingView.propTypes = {
  message: PropTypes.string,
  style: PropTypes.object,
};

export const ErrorView = ({ error }) => {
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
