import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { parseWishList } from '@/roanuz/view/customer/model';
import { ProductPreviewView } from './product/preview';
import { ProductPreviewDisplayMode } from '../layout/product/preview';
import { toolbarPopupView } from '../layout/topToolbarPopupView';
import { RemoveFromWishListMini } from '../controller/product/addToWishList';

const WishListMiniViewWrapper = styled(toolbarPopupView)`
`;

export const WishListMiniView = ({
  show,
  loading, error, wishList: wishListData,
}) => {
  const wishList = (wishListData
    && wishListData.customer && wishListData.customer.wishlist_v2)
    ? parseWishList(wishListData.customer.wishlist_v2) : null;
  const okay = (!loading) && (!error) && (wishList)
  && wishList.items.length > 0;

  return (
    <WishListMiniViewWrapper show={show}>
      <div className="mini-view-container">
        {loading && (
          <div>Hleð lista</div>
        )}
        {error && (
          <div>{error.message}</div>
        )}
        {!okay && (
          <div>Óskalistinn þinn er tómur</div>
        )}
        {okay && (
          <>
            <h4>Óskalistinn þinn inniheldur</h4>
            <div>
              <div className="items">
                {wishList.items.map((item) => (
                  <div className="item" key={item.product.uid}>
                    <ProductPreviewView
                      product={item.product}
                      displayMode={ProductPreviewDisplayMode.TwoCol}
                      actionView={<RemoveFromWishListMini product={item} />}
                    />
                    {/* <div className="tools">
                      <Button
                        noborder
                        iconHeightPx={16}
                        icon={<DeleteIcon />}
                        onClick={() => onRemoveClick(item.id)}
                      >
                        Fjarlægja
                      </Button>
                    </div> */}
                  </div>
                ))}
              </div>
              <div className="summary">
                <p>
                  Samtals:
                  {' '}
                  <strong>{wishList.totalWishListItems}</strong>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </WishListMiniViewWrapper>
  );
};

WishListMiniView.propTypes = {
  show: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  wishList: PropTypes.object,
};
