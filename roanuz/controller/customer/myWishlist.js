import React from 'react';
import styled from 'styled-components';
import { WishListConsumer } from '@/store/core/wishlistContext';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { MyWishListView } from '@/roanuz/view/customer/myWishlist';

const MyWishlistControllerWrapper = styled.div`
  width: 100%;
  @media screen and (min-width: ${Breakpoint.sm}) {
    padding: ${asRem(20)} 0 0 ${asRem(20)};
  }
`;

export const MyWishlistController = () => {
  return (
    <WishListConsumer>
      {(wishListContext) => (
        <MyWishlistControllerWrapper>
          <MyWishListView
            loading={wishListContext.loading}
            error={wishListContext.error}
            wishList={wishListContext.wishListData}
          />
        </MyWishlistControllerWrapper>
      )}
    </WishListConsumer>
  );
};

MyWishlistController.propTypes = {
};
