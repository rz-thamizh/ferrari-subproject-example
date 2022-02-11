import React from 'react';
import { StoreConfigConsumer, shouldRedirectForLogin } from '@/store/core/context';
import MyAccountPage from '@/components/view/customer/account/MyAccountPage';
import { ClientSideView } from '@/roanuz/clientSide';

export const RegisterPage = () => (
  <StoreConfigConsumer>
    {({ storeWidgets }) => (
      <ClientSideView>
        <MyAccountPage
          urlMeta={{}}
          widgets={storeWidgets}
        />
      </ClientSideView>
    )}
  </StoreConfigConsumer>
);

RegisterPage.propTypes = {
};

export async function getServerSideProps({ req, res }) {
  const redirect = await shouldRedirectForLogin({ req, res });
  if (redirect) {
    return redirect;
  }
  return { props: {} };
}

export default RegisterPage;
