import PropTypes from 'prop-types';
import React from 'react';

const StatefulView = ({
  state,
  loading,
  error,
  done,
  children,
}) => {
  let stateView = null;
  let showChildren = true;
  if (state.loading && loading) {
    showChildren = false;
    stateView = loading(state);
  } else if (state.error && error) {
    stateView = error(state);
  } else if (state.data && done) {
    stateView = done(state);
  }
  return (
    <>
      {stateView && stateView}
      {showChildren && children && children}
    </>
  );
};

StatefulView.propTypes = {
  state: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.bool,
    done: PropTypes.bool,
    data: PropTypes.object,
  }),
  loading: PropTypes.elementType,
  error: PropTypes.elementType,
  done: PropTypes.elementType,
  children: PropTypes.element,
};

export default StatefulView;
