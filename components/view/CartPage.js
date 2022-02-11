import React, { useContext } from 'react';
import { SEOHead } from '@/roanuz/document';
import { UserContext, StoreConfigConsumer } from '@/store/core/context';

import { useQuery } from '@apollo/client';
import { CartDetailQuery, CustomerCartDetailQuery } from '@/store/cart/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { parseCart } from '@/roanuz/view/cart/model';
import { CartPageController } from '@/roanuz/controller/cart/cartPage';
import {
  dependencyRegister,
  // eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/cart';
// import { CreateNewCart } from '@/roanuz/controller/product/addToCart';

dependencyRegister();

const CartPage = () => {
  const userContext = useContext(UserContext);
  const {
    loading: pageLoading,
    error: pageError,
    data: cartData,
  } = useQuery(userContext.token ? CustomerCartDetailQuery : CartDetailQuery, {
    variables: { cartId: userContext.cartId },
    // ssr: false,
    skip: userContext.loaded && !userContext.cartId,
    fetchPolicy: 'network-only',
  });

  if (pageLoading || !userContext.cartVerified) return (<PageLoadingView message="Undirbý afgreiðslusíðu" />);
  if (pageError) {
    return (
      <>
        <PageErrorView error={pageError} />
        {/* {!userContext.token && <CreateNewCart />} */}
      </>
    );
  }

  const cartKey = userContext.token ? 'customerCart' : 'cart';
  if (!cartData || !cartData[cartKey] || !cartData[cartKey].items.length) {
    return (
      <PageErrorView
        error={{ message: 'Engar vörur í körfu' }}
      />
    );
  }

  const { rzAllowInvoice, isB2B } = userContext;
  const cart = parseCart(cartData[cartKey], isB2B, rzAllowInvoice);

  return (
    <StoreConfigConsumer>
      {() => (
        <div>
          <SEOHead
            title="Karfa"
          />
          <CartPageController
            cart={cart}
            outOfStockError={userContext.outOfStockError}
          />
        </div>
      )}
    </StoreConfigConsumer>
  );
};

CartPage.propTypes = {
};

export default CartPage;
