import React from 'react';
import { useCartVerified } from '@/store/core/context';
import { CartIndicatorView, CartIndicatorLoadingView } from '@/roanuz/view/cartIndicator';
import { onClient } from '@/roanuz/clientSide';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseCartIndicatorController = () => {
  const {
    verified,
    cartId,
    cartItemsCount,
  } = useCartVerified();

  const isLoading = (!verified);

  return (
    <CartIndicatorView
      loading={isLoading}
      error={null}
      itemsCount={cartItemsCount ?? 0}
      hasCart={cartId !== undefined && cartId !== null}
    />
  );
};

BaseCartIndicatorController.propTypes = {
};

export const CartIndicatorController = withDependencySupport(BaseCartIndicatorController, 'CartIndicatorController');
export const ClientCartIndicatorController = onClient(
  CartIndicatorController,
  { loadingView: (<CartIndicatorLoadingView />) },
);
