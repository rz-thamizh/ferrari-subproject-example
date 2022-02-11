import React from 'react';
import PropTypes from 'prop-types';
import { WishListConsumer } from '@/store/core/wishlistContext';
import { WishListMiniView } from '@/roanuz/view/wishListMini';
import { onClient } from '@/roanuz/clientSide';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseWishListMiniController = ({ show }) => {
  return (
    <WishListConsumer>
      {(wishListContext) => (
        <WishListMiniView
          loading={wishListContext.loading}
          error={wishListContext.error}
          wishList={wishListContext.wishListData}
          show={show}
        />
      )}
    </WishListConsumer>
  );
};

BaseWishListMiniController.propTypes = {
  show: PropTypes.bool,
};

export const WishListMiniController = withDependencySupport(BaseWishListMiniController, 'WishListMiniController');
export const ClientWishListMiniController = onClient(WishListMiniController);
