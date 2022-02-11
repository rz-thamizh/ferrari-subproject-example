import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { parseCart } from '@/roanuz/view/cart/model';
import { ProductPreviewView } from './product/preview';
import { ProductPreviewDisplayMode } from '../layout/product/preview';
import { Button, ButtonList } from './button';
import { toolbarPopupView } from '../layout/topToolbarPopupView';
import { RemoveFromCartMini } from '../controller/product/addToCart';

const CartMiniViewWrapper = styled(toolbarPopupView)`
  .cart-button {
    color: var(--color-text);
    & :hover {
      color: var(--color-text-rev);
    }
  }
  .cart-error {
    color: var(--color-focus);
  }
`;

export const CartMiniView = ({
  show,
  loading, error, cart: cartData,
  cartFieldKey,
  isGuestUser,
  outOfStockError,
}) => {
  const cart = (cartData && cartData[cartFieldKey]) ? parseCart(cartData[cartFieldKey]) : null;
  const okay = (!loading) && (!error) && (cart) && cart.items.length > 0;

  return (
    <CartMiniViewWrapper show={show}>
      <div className="mini-view-container">
        {loading && (
          <div>Hleð körfu</div>
        )}
        {error && (
          <div>
            {error.message}
            {/* {isGuestUser && <CreateNewCart />} */}
          </div>
        )}
        {outOfStockError && (
          <div className="cart-error">
            {outOfStockError}
          </div>
        )}
        {!okay && (
          <div>Karfan þín er tóm</div>
        )}
        {okay && (
          <>
            <h4>Karfan þín inniheldur</h4>
            <div>
              <div className="items">
                {cart.items.map((item) => (
                  <div className="item" key={item.uid}>
                    <ProductPreviewView
                      product={item.product}
                      displayMode={ProductPreviewDisplayMode.TwoCol}
                      actionView={<RemoveFromCartMini product={item} />}
                    />
                  </div>
                ))}
              </div>
              <div className="summary">
                <p>
                  Samtals:&nbsp;
                  <strong>{cart.grandTotalPriceText}</strong>
                </p>
              </div>
              <div className="ctc">
                <ButtonList asList block>
                  <Link href="/checkout/">
                    <Button
                      mode="primary"
                      filled
                      as="a"
                      alt="Ganga frá kaupum"
                      href={{}}
                      ariaLabel="Ganga frá kaupum"
                    >
                      Ganga frá kaupum
                    </Button>
                  </Link>
                </ButtonList>
                <ButtonList asList block>
                  <Link href="/cart/">
                    <Button
                      mode="normal"
                      as="a"
                      alt="Skoða körfu"
                      href={{}}
                      className="cart-button"
                      ariaLabel="Skoða körfu"
                    >
                      Skoða körfu
                    </Button>
                  </Link>
                </ButtonList>
              </div>
            </div>
          </>
        )}
      </div>
    </CartMiniViewWrapper>
  );
};

CartMiniView.propTypes = {
  show: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  cart: PropTypes.object,
  cartFieldKey: PropTypes.string,
  isGuestUser: PropTypes.bool,
  outOfStockError: PropTypes.string,
};
