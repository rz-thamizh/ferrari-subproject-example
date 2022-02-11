import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  Display24, TextMedium14,
} from '@/roanuz/typopgraphy';
import Link from 'next/link';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { DailogView } from '@/roanuz/view/dialog';
import { ReactComponent as CloseIcon } from '@/roanuz/view/imgs/CloseIcon.svg';
// import ShieldIcon from '@/roanuz/view/imgs/ShieldIcon.svg';
import { ProductPreviewView } from './preview';
import { Button, ButtonList } from '../button';
// eslint-disable-next-line import/no-cycle
import { CrosssellProducts } from './crossSellProducts';

const AddToCartSuccessTitleViewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: initial;
  width: 100%;
  h4 {
    order: 2;
    margin-top: ${asRem(10)};
  }
  @media screen and (min-width: ${Breakpoint.sm}) {
    align-items: center;
    flex-direction: initial;
    h4 {
      order: initial;
      margin-top: 0;
    }
  }
  >div {
    display: flex;
    justify-content: space-between;
    width: 100%;
    @media screen and (min-width: ${Breakpoint.sm}) {
      justify-content: initial;
      width: initial;
    }
  }
  button {
    &:not(.icon) {
      color: var(--color-button);
      &:hover {
        filter: brightness(0.7);
      }
      padding-left: 0;
    }
    &.icon {
      color: var(--color-disabled);
      margin-top: ${asRem(5)};
      svg {
        width: ${asRem(24)};
        height: ${asRem(24)};
      }
      >div {
        padding: 0;
      }
      &:hover {
        filter: brightness(0.5);
      }
    }
  }
`;

const AddToCartSuccessViewWrapper = styled.div`
  >.config-container {
    >.config-content {
      .items-line {
        margin: ${asRem(20)} 0;
      }
      .product-item {
        padding-bottom: ${asRem(20)};
        &:last-child {
          padding-bottom: 0;
        }
        &.is-insurance {
          .rz-image-view {
            background: #ECF3FB;
            border-radius: ${asRem(6)};
            display: flex;
            justify-content: center;
            align-items: center;
            img {
              width: ${asRem(38)};
              height: ${asRem(38)};
            }
          }
        }
      }
      .container-image {
        width: ${asRem(80)};
        height: ${asRem(80)};
      }
      .right {
        flex-direction: column;
        justify-content: center;
        color: var(--color-text);
      }
      .container-price {
        padding-left: ${asRem(20)};
        strong {
          font-size: ${asRem(16)};
          line-height: ${asRem(22)};
          @media screen and (min-width: ${Breakpoint.sm}) {
            font-size: ${asRem(24)};
          line-height: ${asRem(32)};
          }
        }
      }
      .container-heading {
        padding-left: ${asRem(20)};
        padding-bottom: ${asRem(8)};
        .sku {
          display: none;
        }
        p {
          font-size: ${asRem(16)};
          line-height: ${asRem(22)};
          @media screen and (min-width: ${Breakpoint.sm}) {
            font-size: ${asRem(20)};
          }
        }
      }
      .ctc {
        text-align: right;
        >div {
          display: block;
        }
        a {
          text-decoration: none;
          margin-top: ${asRem(5)};
          &:last-child {
            margin-left: ${asRem(10)};
          }
          @media screen and (min-width: ${Breakpoint.sm}) {
            margin-top: 0;
            margin-left: ${asRem(10)};
          }
        }
      }
    }
  }
`;

export const AddToCartSuccessView = ({
  show,
  showCrosssellProducts,
  onOptionCancel,
  products,
  crossSellProducts,
  onCrosssellProductAdded,
}) => {
  return (
    <DailogView
      id="cart-success"
      show={show}
      containerWidth="530px"
      titleSection={(
        <AddToCartSuccessTitleViewWrapper>
          <Display24>Vöru bætt í körfu</Display24>
          <div>
            <Button
              onClick={onOptionCancel}
              noborder
              ariaLabel="Halda áfram að versla"
            >
              <TextMedium14>Halda áfram að versla</TextMedium14>
            </Button>
            <Button
              className="icon"
              icon={<CloseIcon />}
              noborder
              onClick={onOptionCancel}
              ariaLabel="Close Icon Button"
            />
          </div>
        </AddToCartSuccessTitleViewWrapper>
      )}
    >
      <AddToCartSuccessViewWrapper>
        <div className="config-container">
          <div className="config-content">
            <div className="items-line">
              {products && products.map((product) => (
                <div
                  className="product-item"
                  key={product.sku}
                >
                  <ProductPreviewView
                    shouldLinkTitle={false}
                    product={product}
                  />
                </div>
              ))}
              {crossSellProducts && showCrosssellProducts && (
                <CrosssellProducts
                  products={crossSellProducts}
                  onConfirm={onCrosssellProductAdded}
                />
              )}
            </div>
            <div className="ctc">
              <ButtonList>
                <Link href="/cart/">
                  <Button
                    mode="primary"
                    as="a"
                    alt="Skoða körfu"
                    href={{}}
                    ariaLabel="Skoða körfu"
                  >
                    Skoða körfu
                  </Button>
                </Link>
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
          </div>
        </div>
      </AddToCartSuccessViewWrapper>
    </DailogView>
  );
};

AddToCartSuccessView.propTypes = {
  show: PropTypes.bool,
  onOptionCancel: PropTypes.func,
  products: PropTypes.array,
  crossSellProducts: PropTypes.array,
  onCrosssellProductAdded: PropTypes.func,
  showCrosssellProducts: PropTypes.bool,
};
