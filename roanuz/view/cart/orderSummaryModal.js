import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { CartSideView } from '@/roanuz/view/cart/side';
import { Button } from '@/roanuz/view/button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Display20, DisplayBold20 } from '@/roanuz/typopgraphy';
import { ReactComponent as UserIcon } from '@/roanuz/view/imgs/UserIcon.svg';
import { ReactComponent as ShoppingBagIcon } from '@/roanuz/view/imgs/ShoppingBagIcon.svg';
import { ReactComponent as CloseIcon } from '@/roanuz/view/imgs/CloseIcon.svg';
import { IconIndicatorView } from '@/roanuz/view/iconIndicator';
import { UserConsumer } from '@/store/core/context';

const OrderSummaryWrapper = styled.div`
  margin-bottom: ${asRem(20)};
  >.links {
    margin-right: -${asRem(15)};
    margin-left: -${asRem(15)};
    padding: ${asRem(14)} ${asRem(20)};
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(22, 108, 200, 0.1);
    svg {
      width: ${asRem(28)};
      height: ${asRem(28)};
    }
    button {
      margin-left: ${asRem(20)};
      color: var(--color-button);
    }
  }
  .cart-summary-card {
    position: fixed;
    top: 0;
    right: -${asRem(340)};
    bottom: 0;
    overflow-y: auto;
    background: #FFFFFF;
    box-shadow: 0px 0px 12px rgba(51, 51, 51, 0.18);
    padding: ${asRem(20)};
    z-index: 998;
    max-width: ${asRem(340)};
    transition: all .3s ease-in-out;
    &.show {
      right: 0;
    }
    >p {
      text-align: right;
      position: absolute;
      right: ${asRem(10)};
      top: ${asRem(15)};
      button {
        padding: ${asRem(10)};
        div {
          padding-right: 0;
        }
      }
    }
    > div {
      >div {
        padding-left: 0;
        padding-right: 0;
        padding-top: 0;
      }
    }
  }
`;

export const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  bottom: 0;
  background-color: rgba(51, 51, 51, 0.48);
  z-index: 8;
  opacity: 0;
  transtion: all 0.3s ease-in-out;
  ${(p) => p.show && css`
    opacity: 1;
    width: 100%;
  `}
`;

export const OrderSummaryModalView = ({ cart, onEditShippingDetails, showPaymentMethod }) => {
  const [summaryModal, setSummaryModal] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(cart.total_quantity);
  const router = useRouter();
  const userConsumer = useContext(UserConsumer);

  const showSummaryModal = () => {
    setSummaryModal(true);
  };
  const hideSummaryModal = () => {
    setSummaryModal(false);
  };
  const hideAndEdit = () => {
    setSummaryModal(false);
    onEditShippingDetails();
  };

  useEffect(() => {
    setCartItemsCount(cart.total_quantity);
  }, [cart.total_quantity]);

  return (
    <OrderSummaryWrapper>
      <div className="links">
        <div className="left">
          <Display20>Samtals</Display20>
          <DisplayBold20>{cart.grandTotalPriceText}</DisplayBold20>
        </div>
        <div className="right">
          <Button
            noborder
            nomargin
            onClick={showSummaryModal}
            ariaLabel="Bag Icon Button"
          >
            <IconIndicatorView
              item={{ total_quantity: cartItemsCount }}
              iconHeightPx={28}
            >
              <ShoppingBagIcon />
            </IconIndicatorView>
          </Button>
          {!showPaymentMethod && (
            <Link prefetch={false} href={userConsumer.token ? '/customer/account' : `/customer/account/login?next=${router && router.asPath ? router.asPath : null}`}>
              <Button
                icon={<UserIcon />}
                mode="primary"
                noborder
                nomargin
                ariaLabel="User Icon Button"
              />
            </Link>
          )}
        </div>
      </div>
      <ModalBackground
        show={summaryModal}
        onClick={hideSummaryModal}
      />
      <div className={`cart-summary-card ${summaryModal ? 'show' : ''}`}>
        <>
          <p>
            <Button
              icon={<CloseIcon />}
              noborder
              nomargin
              onClick={hideSummaryModal}
              ariaLabel="Close Button"
            />
          </p>
          <CartSideView
            cart={cart}
            showShipping={showPaymentMethod}
            onEditShippingDetails={hideAndEdit}
          />
        </>
      </div>
    </OrderSummaryWrapper>
  );
};

OrderSummaryModalView.propTypes = {
  cart: PropTypes.object.isRequired,
  onEditShippingDetails: PropTypes.func,
  showPaymentMethod: PropTypes.bool,
};
