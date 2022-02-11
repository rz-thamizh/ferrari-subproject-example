import Config from '@/config';
import { asRem } from '@/roanuz/lib/css';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

export const PageLoadingViewWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: ${asRem(60)} 0;
  >div {
    background: whitesmoke;
    text-align: center;
    padding: ${asRem(20)};
    min-width: ${asRem(280)};
    border-radius: ${asRem(10)};
  }
`;

const PageLoadingView = ({ message }) => {
  if (!Config.IsProd) {
    // console.log('Page:', message);
  }
  return (
    <PageLoadingViewWrapper className="page-status-container">
      <div>
        {message || 'Hleð...'}
      </div>
    </PageLoadingViewWrapper>
  );
};

PageLoadingView.propTypes = {
  message: PropTypes.string,
};

export default PageLoadingView;
