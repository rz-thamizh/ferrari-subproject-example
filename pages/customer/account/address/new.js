import React from 'react';
import { StoreConfigConsumer, shouldRedirectForLogin } from '@/store/core/context';
import NewAddressPage from '@/components/view/customer/account/NewAddressPage';
import { ClientSideView } from '@/roanuz/clientSide';

export const AddAddressPage = () => (
  <StoreConfigConsumer>
    {({ storeWidgets }) => (
      <ClientSideView>
        <NewAddressPage
          urlMeta={{}}
          widgets={storeWidgets}
        />
      </ClientSideView>
    )}
  </StoreConfigConsumer>
);

AddAddressPage.propTypes = {
};

export async function getServerSideProps({ req, res }) {
  const redirect = await shouldRedirectForLogin({ req, res });
  if (redirect) {
    return redirect;
  }
  return { props: {} };
}

export default AddAddressPage;
