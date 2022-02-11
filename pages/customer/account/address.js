import React from 'react';
import { StoreConfigConsumer, shouldRedirectForLogin } from '@/store/core/context';
import MyAddressPage from '@/components/view/customer/account/MyAddressPage';
import { ClientSideView } from '@/roanuz/clientSide';

export const AddressPage = () => (
  <StoreConfigConsumer>
    {({ storeWidgets }) => (
      <ClientSideView>
        <MyAddressPage
          urlMeta={{}}
          widgets={storeWidgets}
        />
      </ClientSideView>
    )}
  </StoreConfigConsumer>
);

AddressPage.propTypes = {
};

export async function getServerSideProps({ req, res }) {
  const redirect = await shouldRedirectForLogin({ req, res });
  if (redirect) {
    return redirect;
  }
  return { props: {} };
}

export default AddressPage;
