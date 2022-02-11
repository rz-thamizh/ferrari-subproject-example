import React from 'react';
import PropTypes from 'prop-types';
import { StoreSpecificContent } from '@/store/core/storeUtils';
import { IconIndicatorView } from './iconIndicator';

export const WishListIndicatorView = ({
  loading, error, item,
}) => {
  const { wishListIcon } = StoreSpecificContent;
  return (
    <IconIndicatorView
      loading={loading}
      error={error}
      item={item}
      hideIndicatorForZero={!item || item.total_quantity === 0}
      iconHeightPx={24}
    >
      {wishListIcon}
    </IconIndicatorView>
  );
};

WishListIndicatorView.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  item: PropTypes.shape({
    total_quantity: PropTypes.number,
  }),
};
