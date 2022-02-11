import React from 'react';
import { StoreConfigConsumer } from '@/store/core/context';
import CreateAccountPage from '@/components/view/customer/account/CreateAccountPage';

export const RegisterPage = () => (
  <StoreConfigConsumer>
    {({ storeWidgets }) => (
      <CreateAccountPage
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
