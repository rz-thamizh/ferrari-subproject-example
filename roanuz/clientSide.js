import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getDisplayName } from '@/roanuz/lib/utils';

const ClientSideViewWrapper = styled.div`
`;

export const ClientSideView = ({
  showLoading,
  loadingView,
  message, children,
}) => {
  const [mounted, setMounted] = useState(false);
  const msg = message || 'Hleð...';

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setMounted(true);
  });

  if (mounted) {
    return children;
  }

  if (loadingView) {
    return loadingView;
  }

  if (!showLoading) {
    return null;
  }

  return (
    <ClientSideViewWrapper>
      {msg}
    </ClientSideViewWrapper>
  );
};

ClientSideView.propTypes = {
  showLoading: PropTypes.bool,
  message: PropTypes.string,
  loadingView: PropTypes.element,
  children: PropTypes.element,
};

export function onClient(
  Component,
  { showLoading = false, loadingView = null } = {},
) {
  const displayName = getDisplayName(Component);

  // eslint-disable-next-line react/prefer-stateless-function
  class ClientSideComp extends React.Component {
    render() {
      return (
        <ClientSideView showLoading={showLoading} loadingView={loadingView}>
          <Component {...this.props} />
        </ClientSideView>
      );
    }
  }

  ClientSideComp.displayName = `onClient(${displayName})`;
  return ClientSideComp;
}
