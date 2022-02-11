import React from 'react';
import PropTypes from 'prop-types';

const LoadingView = ({ message }) => (
  <div className="container debug-loading-view">
    <div className="row">
      <div
        className="col-12 text-center"
        style={{
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
};

export default LoadingView;
