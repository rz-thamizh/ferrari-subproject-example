import React from 'react';
import { StoreConfigConsumer, shouldRedirectForLogin } from '@/store/core/context';
import MyWishListPage from '@/components/view/customer/account/MyWishListPage';

export const WishlistPage = () => (
  <StoreConfigConsumer>
    {({ storeWidgets }) => (
      <MyWishListPage
        urlMeta={{}}
        widgets={storeWidgets}
      />
    )}
  </StoreConfigConsumer>
);

WishlistPage.propTypes = {
};

export async function getServerSideProps({ req, res }) {
  const redirect = await shouldRedirectForLogin({ req, res });
  if (redirect) {
    return redirect;
  }
  return { props: {} };
}

export default WishlistPage;
