import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';
import {
  TextMedium16, DisplayBold24, Bold16, DisplayBold20,
} from '@/roanuz/typopgraphy';
import { CouponView } from './coupon';
import { ProductPreviewView } from '../product/preview';
import { AdddressCardView } from './addressCard';
import { Button, ButtonList } from '../button';

const CartSideViewWrapper = styled.div`
  h4 {
    margin-bottom: ${asRem(20)};
  }

  .name-value-line {
    display: flex;
    justify-content: space-between;
    >div {
      display: block;
    }

    >.value {
      text-align: right;
      >button {
        font-size: ${asRem(16)};
        font-weight: 500;
      }
    }
  }

  .shipping-line {
    padding-top: ${asRem(20)};
    padding-bottom: ${asRem(20)};
    &.shipping-line-discount{
      padding-top: ${asRem(0)};
    }
  }
  .total-line {
    padding-top: ${asRem(20)};
    border-top: 1px solid var(--color-disabled-3);
    h4 {
      margin-bottom: 0;
    }
  }


  .items-line {
    padding-top: ${asRem(40)};
    padding-bottom: ${asRem(10)};
    >.label {
      border-bottom: 1px solid var(--color-disabled-3);
    }

    >.cart-items {
      >div {
        padding-top: ${asRem(20)};
        padding-bottom: ${asRem(20)};
        border-bottom: 1px solid var(--color-disabled-3);
      }
      .right {
        flex-direction: column;
        @media screen and (min-width: ${Breakpoint.lg}) {
          flex-direction: initial;
        }
      }
    }
  }

  .card-section {
    padding-top: ${asRem(30)};
    padding-bottom: ${asRem(10)};
    >.label {
      padding-bottom: ${asRem(10)};
      border-bottom: 1px solid var(--color-disabled-3);
    }
    >.card-item {
      padding-top: ${asRem(10)};

      >.label {
        >.rz-address-card {
          min-height: auto;
        }
      }
    }
  }

  .shipping-detail-line {
    p:last-child {
      padding-top: ${asRem(10)};
    }
  }

  @media screen and (min-width: ${Breakpoint.lg}) {
    .container-price {
      min-width: ${asRem(120)};
      text-align: right;
    }
  }

  .checkout-btn {
    margin-top: ${asRem(20)};
  }
`;

export const CartSideView = ({
  cart, showShipping, onEditShippingDetails, isCartPage,
}) => {
  return (
    <CartSideViewWrapper>
      <FormWrapperStyle>
        <DisplayBold20>Yfirlit pöntunnar</DisplayBold20>
        <div className="coupons-line-title name-value-line">
          <TextMedium16 className="label">Afsláttarkóði</TextMedium16>
        </div>
        <CouponView cart={cart} />
        <div className="shipping-line name-value-line">
          <TextMedium16 className="label">Sendingarkostnaður</TextMedium16>
          <TextMedium16 className="value">
            {cart.shippingChargeText === null
              ? 'Sjá í pöntunarferli'
              : cart.shippingChargeText}
          </TextMedium16>
        </div>
        {cart.discounts.map((item) => (
          <div className="shipping-line shipping-line-discount name-value-line" key={item.uid}>
            <TextMedium16 className="label">Afsláttur</TextMedium16>
            <TextMedium16 className="value">{item.priceText}</TextMedium16>
          </div>
        ))}
        <div className="name-value-line total-line">
          <DisplayBold24 className="label">Samtals</DisplayBold24>
          <DisplayBold24 className="value">{cart.grandTotalPriceText}</DisplayBold24>
        </div>
      </FormWrapperStyle>
      {!isCartPage && (
        <FormWrapperStyle>
          <div className="items-line">
            <TextMedium16 className="label">Karfa</TextMedium16>
            <div className="value cart-items">
              {cart.items.map((line) => (
                <ProductPreviewView
                  key={line.uid}
                  product={line.product}
                />
              ))}
            </div>
          </div>
        </FormWrapperStyle>
      )}
      {isCartPage && (
        <div className="checkout-btn">
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
        </div>
      )}
      <FormWrapperStyle>
        {(showShipping && cart.shippingAddress) && (
          <div className="shipping-address-line card-section">
            <TextMedium16 className="label">Móttakandi</TextMedium16>
            <div className="name-value-line card-item">
              <div className="label">
                <AdddressCardView address={cart.shippingAddress} />
              </div>
              <div className="value">
                <Button
                  mode="primary"
                  noborder
                  nomargin
                  onClick={onEditShippingDetails}
                  ariaLabel="Breyta"
                >
                  Breyta
                </Button>
              </div>
            </div>
          </div>
        )}

        {showShipping && cart.shippingMethod && (
          <>
            <div className="shipping-detail-line card-section">
              <TextMedium16 className="label">Sendingarmáti</TextMedium16>
              <div className="name-value-line card-item">
                <Bold16 className="label">{cart.shippingChargeText}</Bold16>
                <div className="value">
                  <Button
                    mode="primary"
                    noborder
                    nomargin
                    onClick={onEditShippingDetails}
                    ariaLabel="Breyta"
                  >
                    Breyta
                  </Button>
                </div>
              </div>
              <TextMedium16>{cart.shippingMethod.title}</TextMedium16>
            </div>
          </>
        )}
      </FormWrapperStyle>
    </CartSideViewWrapper>
  );
};

CartSideView.propTypes = {
  cart: PropTypes.object.isRequired,
  showShipping: PropTypes.bool,
  onEditShippingDetails: PropTypes.func,
  isCartPage: PropTypes.bool,
};
