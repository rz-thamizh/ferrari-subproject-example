import React from 'react';
import PropTypes from 'prop-types';
import { StoreConfigConsumer } from '@/store/core/context';
import ResetPasswordPage from '@/components/view/customer/account/ResetPasswordPage';

export const RegisterPage = ({ isB2b = false }) => (
  <StoreConfigConsumer>
    {({ storeWidgets }) => (
      <ResetPasswordPage
        widgets={storeWidgets}
        isB2bCustomer={isB2b}
      />
    )}
  </StoreConfigConsumer>
);

RegisterPage.propTypes = {
  isB2b: PropTypes.bool,
};

export async function getServerSideProps() {
  return { props: {} };
}

export default RegisterPage;
