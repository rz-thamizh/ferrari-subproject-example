import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { ProductPreviewView } from '../product/preview';
import { RemoveFromCartMini, QuantitySelector } from '../../controller/product/addToCart';

const CartSideViewWrapper = styled(FormWrapperStyle)`
  @media screen and (min-width: ${Breakpoint.lg}) {
    --size-product-card-preview-image-width: ${asRem(110)};
  }
  >div {
    border-bottom: ${asRem(1)} solid var(--color-border-2);
    padding: ${asRem(12)} 0;
    @media screen and (min-width: ${Breakpoint.sm}) {
      padding: ${asRem(30)} 0;
    }
    &:first-child {
      padding-top: 0;
    }
    .rz-product-preview {
      position: relative;
      button {
        padding-right: 0;
        padding-bottom: 0;
        font-weight: 500;
      }
      > .container > .right {
        flex-direction: column;
        justify-content: initial;
        @media screen and (min-width: ${Breakpoint.sm}) {
          justify-content: space-between;
        }
        @media screen and (min-width: ${Breakpoint.md}) {
          flex-direction: row;
        }
        > .container-heading {
          padding-left: ${asRem(20)};
          @media screen and (min-width: ${Breakpoint.md}) {
            width: ${asRem(235)};
          }
          @media screen and (min-width: ${Breakpoint.lg}) {
            width: ${asRem(385)};
          }
        }
        > .container-price {
          width: ${asRem(150)};
          @media screen and (min-width: ${Breakpoint.md}) {
            text-align: right;
          }
          padding-left: ${asRem(20)};
        }
      }
    }
    .container-price strong {
      font-size: ${asRem(16)};
      line-height: ${asRem(22)};
      @media screen and (min-width: ${Breakpoint.sm}) {
        font-size: ${asRem(20)};
        line-height: ${asRem(26)};
      }
    }
    .container-action {
      margin-top: 0;
      @media screen and (min-width: ${Breakpoint.sm}) {
        margin-top: ${asRem(15)};
        position: absolute;
        bottom: 0;
        right: 0;
      }
    }
    .container-quantity {
      @media screen and (min-width: ${Breakpoint.md}) {
        width: initial;
      }
    }
    .quantity-selector {
      padding-left: ${asRem(20)};
      .rz-form-select {
        border-color: var(--color-text);
        svg {
          fill: var(--color-text);
        }
      }
      .rz-form-item {
        margin-right: 0;
        max-width: ${asRem(80)};
        width: ${asRem(80)};
        .rz-form-field {
          padding-right: ${asRem(5)};
          padding-left: ${asRem(5)};
        }
      }
      span[class*="-indicatorSeparator"] {
        display: none;
      }
      div[class*="-control"] {
        padding: ${asRem(3)} ${asRem(2)} ${asRem(2)};
      }
      div[class*="-singleValue"] {
        color: var(--color-text);
        font-weight: 600;
      }
      .rz-statefull-button {
        display: block;
        position: relative;
        top: ${asRem(15)};
        button:focus-visible {
          outline: 0;
        }
      }
      .debug-loading-view, .debug-error-view {
        font-size: ${asRem(14)};
        .row >div {
          transform: initial !important;
        }
        color: var(--color-disabled);
      }
      .update-success {
        color: var(--color-active-2);
        font-size: ${asRem(14)};
      }
      .debug-error-view {
        color: var(--color-error);
        @media screen and (min-width: ${Breakpoint.sm}) {
          position: absolute;
          left: 0;
          bottom: -${asRem(45)};
        }
        @media screen and (min-width: ${Breakpoint.md}) {
          bottom: -${asRem(25)};
        }
      }
    }
  }
`;

export const CartItemsListView = ({
  cart,
}) => {
  return (
    <CartSideViewWrapper>
      {cart.items.map((line) => (
        <ProductPreviewView
          key={line.uid}
          product={line.product}
          actionView={<RemoveFromCartMini product={line} />}
          quantityUpdate={<QuantitySelector product={line} />}
          hideQuantity
        />
      ))}
    </CartSideViewWrapper>
  );
};

CartItemsListView.propTypes = {
  cart: PropTypes.object.isRequired,
};
