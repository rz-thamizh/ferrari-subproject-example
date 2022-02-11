import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '@/store/core/context';
import { StoreSpecificContent } from '@/store/core/storeUtils';
import { IconIndicatorView } from './iconIndicator';

export const CartIndicatorView = ({
  loading, error, itemsCount,
  hasCart,
}) => {
  const userContext = useContext(UserContext);
  const { cartIcon } = StoreSpecificContent;
  const { cartInternallyProcessing } = userContext;
  return (
    <>
      <IconIndicatorView
        loading={loading || cartInternallyProcessing}
        error={error}
        item={{ total_quantity: hasCart ? itemsCount : 0 }}
        iconHeightPx={28}
      >
        {cartIcon}
      </IconIndicatorView>
    </>
  );
};

CartIndicatorView.propTypes = {
  loading: PropTypes.bool,
  hasCart: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  itemsCount: PropTypes.number,
};

export const CartIndicatorLoadingView = () => {
  return (
    <CartIndicatorView
      loading
    />
  );
};
