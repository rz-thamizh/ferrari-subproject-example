import Config from '@/config';
import { asRem } from '@/roanuz/lib/css';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

export const PageErrorViewWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: ${asRem(60)} 0;
  >div {
    background: #ffebf6;
    text-align: center;
    padding: ${asRem(20)};
    min-width: ${asRem(280)};
    border-radius: ${asRem(10)};
  }
`;

const PageErrorView = ({ error }) => {
  if (!Config.IsProd) {
    console.log('Page Error');
    console.error(error);
  }
  return (
    <PageErrorViewWrapper className="page-status-container">
      <div>
        {error ? error.message : 'Error!'}
      </div>
    </PageErrorViewWrapper>
  );
};

PageErrorView.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
  }),
};

export default PageErrorView;
