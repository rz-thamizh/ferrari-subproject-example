import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { UserContext } from '@/store/core/context';
import { CartMiniQuery, CustomerCartMiniQuery } from '@/store/cart/query';
import { CartMiniView } from '@/roanuz/view/cartMini';
import { onClient } from '@/roanuz/clientSide';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseCartMiniController = ({ show }) => {
  const userContext = useContext(UserContext);
  const {
    loading,
    error,
    data: cartData,
  } = useQuery(userContext.token ? CustomerCartMiniQuery : CartMiniQuery, {
    variables: { cartId: userContext.cartId },
    ssr: false,
    skip: !userContext.cartId,
    fetchPolicy: 'network-only',
  });
  const cartKey = userContext.token ? 'customerCart' : 'cart';

  return (
    <CartMiniView
      loading={loading && !userContext.cartVerified}
      error={error}
      cart={cartData}
      show={show}
      cartFieldKey={cartKey}
      isGuestUser={!userContext.token}
      outOfStockError={userContext.outOfStockError}
    />
  );
};

BaseCartMiniController.propTypes = {
  show: PropTypes.bool,
};

export const CartMiniController = withDependencySupport(BaseCartMiniController, 'CartMiniController');
export const ClientCartMiniController = onClient(CartMiniController);
