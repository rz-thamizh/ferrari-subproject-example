import React from 'react';
import { SEOHead } from '@/roanuz/document';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { StoreConfigConsumer } from '@/store/core/context';
import { ResetPasswordController } from '@/roanuz/controller/customer/resetPassword';

const ResetPasswordPageWrapper = styled.div`
`;

const ResetPasswordPage = ({ isB2bCustomer }) => {
  return (
    <StoreConfigConsumer>
      {() => (
        <ResetPasswordPageWrapper>
          <SEOHead
            title={isB2bCustomer ? 'Endurstilla lykilorð' : 'Gleymt lykilorð'}
          />
          <div>
            <ResetPasswordController isB2bCustomer={isB2bCustomer} />
          </div>
        </ResetPasswordPageWrapper>
      )}
    </StoreConfigConsumer>
  );
};

ResetPasswordPage.propTypes = {
  isB2bCustomer: PropTypes.bool,
};

export default ResetPasswordPage;
