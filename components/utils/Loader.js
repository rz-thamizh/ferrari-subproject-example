import PropTypes from 'prop-types';
import React from 'react';

const Loader = ({ loading }) => {
  if (loading === false) {
    return null;
  }

  return (
    <div className="container">
      <div className="row">
        <div
          className="col-12 text-center"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          Hleð...
        </div>
      </div>
    </div>
  );
};

Loader.propTypes = {
  loading: PropTypes.bool,
};

export default Loader;
