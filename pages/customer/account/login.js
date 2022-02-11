import React from 'react';
import { StoreConfigConsumer } from '@/store/core/context';
import LoginAccountPage from '@/components/view/customer/account/LoginAccountPage';

export const RegisterPage = () => (
  <StoreConfigConsumer>
    {({ storeWidgets }) => (
      <LoginAccountPage
        urlMeta={{}}
        widgets={storeWidgets}
      />
    )}
  </StoreConfigConsumer>
);

RegisterPage.propTypes = {
};

export async function getServerSideProps() {
  return { props: {} };
}

export default RegisterPage;
