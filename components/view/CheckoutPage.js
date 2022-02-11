import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { SEOHead } from '@/roanuz/document';
import { UserContext, StoreConfigConsumer } from '@/store/core/context';
import ContainerWidgets from '@/components/layout/ContainerWidgets';
import { LayoutContainer } from '@/store/layout/layout';
import { filterCartWidgets } from '@/store/layout/widget';
import { useQuery } from '@apollo/client';
import { CartDetailQuery, CustomerCartDetailQuery } from '@/store/cart/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { parseCart } from '@/roanuz/view/cart/model';
import { CheckoutPageController } from '@/roanuz/controller/cart/page';
import {
  dependencyRegister,
  // eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/checkout';
// import { CreateNewCart } from '@/roanuz/controller/product/addToCart';

dependencyRegister();

const CheckoutPage = ({ widgets }) => {
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
  // if (!cartData || !cartData.cart) {
  //   userContext.unsetCartId();
  // }

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
  const pageWidgets = filterCartWidgets({ widgets, cart });

  return (
    <StoreConfigConsumer>
      {() => (
        <div>
          <SEOHead
            title="Afgreiða"
          />
          <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentTop} />
          <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.Content} />
          <CheckoutPageController
            cart={cart}
          />
          <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentBottom} />
        </div>
      )}
    </StoreConfigConsumer>
  );
};

CheckoutPage.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.object),
};

export default CheckoutPage;
