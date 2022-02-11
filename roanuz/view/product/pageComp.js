import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withDependencySupport } from '@/roanuz/lib/dep';
import MagentoHtml from '@/components/layout/MagentoHtml';
import {
  DisplayBold40, DisplayBold20, Text14,
  TextBold14, TextMedium14,
} from '@/roanuz/typopgraphy';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { ReactComponent as ReturnDaysIcon } from '@/roanuz/view/imgs/ReturnDaysIcon.svg';
import { ReactComponent as FormIcon } from '@/roanuz/view/imgs/FormIcon.svg';
import { Button, ButtonList } from '@/roanuz/view/button';
import Config from '@/config';

import { ProductAsOptionView } from './productAsOption';
import { StockStatus } from './models/stock';
import { StockAlertView } from './stockAlert';
import { SVGIcon } from '../icon';
import { LabelKind, ProductLabelView, ProductPriceHeadView } from './label';

export const ProductPageShortDescViewWrapper = styled(TextMedium14)`
  .prod-page-desc-title {
    display: none;
  }

  .rz-magento-html {
    margin-bottom: ${asRem(14)};
    iframe {
      padding: ${asRem(20)} 0;
      max-width: 100%;
    }
    ul {  
      list-style: disc inside none;
      li {
        padding-bottom: ${asRem(12)};
      }
    }
  }

  .read-more {
    font-weight: 500;
    margin-top: ${asRem(-5)};
    margin-bottom: ${asRem(15)};
    padding: 0;
  }
`;

export const ProductPageShortDescView = ({ product }) => {
  const showDetailDescription = () => {
    const descEle = document.getElementById('product_detail_description');
    if (descEle) {
      if (descEle.classList.contains('closed')) {
        descEle.click();
      }
      descEle.scrollIntoView();
    }
  };

  return (
    <ProductPageShortDescViewWrapper as="div">
      <TextBold14 as="strong" className="prod-page-desc-title">Vörulýsing</TextBold14>
      <MagentoHtml
        html={product.shortDesc}
      />
      <Button
        ariaLabel="Lesa meira"
        className="read-more"
        mode="primary"
        noborder
        onClick={showDetailDescription}
      >
        Lesa meira
      </Button>
    </ProductPageShortDescViewWrapper>
  );
};

ProductPageShortDescView.propTypes = {
  product: PropTypes.object,
};

export const ProductPageReturnDaysViewWrapper = styled.div`
  &.returnDays {
    display: flex;
    >.rz-svg-icon {
      margin-top: 0.5ch;
      margin-right: ${asRem(14)};
      display: block;
    }
    section {
      >strong {
        padding-bottom: ${asRem(4)};
      }
    }
  }
`;

export const ProductPageReturnDaysView = ({ product }) => {
  return (
    <ProductPageReturnDaysViewWrapper className="returnDays">
      <SVGIcon heightPx={42}>
        <ReturnDaysIcon />
      </SVGIcon>
      <section>
        <TextBold14 as="strong">Skilareglur</TextBold14>
        <TextMedium14>
          {(product.returnDays && product.returnDays !== '0') ? (
            `${product.returnDays} skilaréttur`
          ) : (`${Config.ProductReturndays} daga skilaréttur`)}
        </TextMedium14>
      </section>
    </ProductPageReturnDaysViewWrapper>
  );
};

ProductPageReturnDaysView.propTypes = {
  product: PropTypes.object,
};

export const ProductPageSiminnLoanView = ({ product, SiminnLoan }) => {
  if ((!SiminnLoan) || (product.price < Config.MinAmountForLoan)) {
    return null;
  }

  return (
    <div className="section-loan">
      <SiminnLoan product={product} />
    </div>
  );
};

ProductPageSiminnLoanView.propTypes = {
  product: PropTypes.object,
  SiminnLoan: PropTypes.elementType,
};

export const ProductPageOptionsView = ({ product, onCartUpdate, hideProductPageOptionsView }) => {
  if (hideProductPageOptionsView) {
    return null;
  }
  return (
    <ProductAsOptionView
      product={product}
      onChange={(value) => {
        if (onCartUpdate) {
          onCartUpdate('with-product', value);
        }
        return null;
      }}
    />
  );
};

ProductPageOptionsView.propTypes = {
  product: PropTypes.object,
  onCartUpdate: PropTypes.func,
  hideProductPageOptionsView: PropTypes.bool,
};

export const ProductPagePriceViewLayout = styled.div`
  &.section-price {
    >.product-label {
      margin-bottom: ${asRem(6)};
      .rz-product-label {
        padding: ${asRem(2)} ${asRem(6)};
        display: inline-block;
        font-size: ${asRem(12)};
        line-height: ${asRem(16)};
        @media screen and (min-width: ${Breakpoint.md}) {
          padding: ${asRem(4)} ${asRem(10)};
        }
        span {
          font-weight: bold;
        }
      }
    }

    >.product-sale {
      margin-bottom: ${asRem(2)};
      .discount {
        font-weight: bold;
        font-size: ${asRem(12)};
        line-height: ${asRem(16)};
        padding: ${asRem(4)} ${asRem(10)};
        color: var(--color-text-rev);
        background: var(--color-focus);
      }

      > .regular-price, > .variable-price-label {
        font-size: ${asRem(16)};
        line-height: ${asRem(20)};
        padding: ${asRem(2)} 0;
      }
    }
  }
`;

export const ProductPagePriceView = ({ product }) => {
  const hasPriceHead = product.onSale
    || product.onDiscount
    || product.hasVariablePrice;

  const { labelKind } = product;
  let { label } = product;

  if (labelKind === LabelKind.Refurbished) {
    label = null;
  }

  if (product.hasPrice) {
    return (
      <ProductPagePriceViewLayout className="section-price">
        {label && (
          <div className="product-label">
            <ProductLabelView
              text={label}
              kind={labelKind}
              product={product}
            />
          </div>
        )}
        {hasPriceHead && (
          <ProductPriceHeadView className="product-sale" product={product} />
        )}
        <DisplayBold40>
          {product.priceText}
        </DisplayBold40>
      </ProductPagePriceViewLayout>
    );
  }
  return (
    <ProductPagePriceViewLayout className="section-no-price">
      <DisplayBold40>
        Fá tilboð
      </DisplayBold40>
    </ProductPagePriceViewLayout>
  );
};

ProductPagePriceView.propTypes = {
  product: PropTypes.object,
};

export const ProductPageActionViewLayout = styled.div`
  &.section-action {
    @media screen and (min-width: ${Breakpoint.sm}) {
      border-top: 1px solid var(--color-grey-2);
      padding-top: ${asRem(20)};
    }
  }

  &.section-action-soldout {
    >.action-button-list {
      padding-top: ${asRem(20)};
    }
  }

  .action-button-list {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 120;
    background: #fff;
    box-shadow: 0px 4px 20px rgba(51, 51, 51, 0.12);
    border: 1px solid #EFEFEF;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${asRem(10)} ${asRem(20)};

    .rz-button-soldout {
      margin-bottom: 0;
    }

    @media screen and (min-width: ${Breakpoint.sm}) {
      position: initial;
      background: transparent;
      box-shadow: none;
      border: 0;
      display: block;
      padding: 0;
      z-index: 0;
    }
  }
`;

export const ProductPageActionView = ({
  product,
  DeliveryPickup,
  onEnquiryForm,
  stockAlertLoading,
  stockAlertError,
  onStockAlert,
  addToCart, addToWishList,
  onCartUpdate,
}) => {
  if ((product.stockStatus.status === StockStatus.SOLD_OUT
    || product.stockStatus.status === StockStatus.SPECIAL_ORDER)) {
    return (
      <ProductPageActionViewLayout className="section-action section-action-soldout">
        <Text14>
          Þessa vöru þarf að sérpanta, sendu okkur fyrirspurn og við verðum í sambandi
        </Text14>
        <div className="action-button-list">
          <DisplayBold20 className="hide-desktop">
            {product.hasPrice && product.priceText}
          </DisplayBold20>
          <ButtonList asList block reverseOnMobile>
            <Button
              icon={<FormIcon />}
              mode="primary"
              large
              onClick={onEnquiryForm}
              ariaLabel="Senda fyrirspurn"
              className="rz-button-soldout"
            >
              Senda fyrirspurn
            </Button>
            {addToWishList}
          </ButtonList>
        </div>
      </ProductPageActionViewLayout>
    );
  }

  return (
    <ProductPageActionViewLayout className="section-action">
      {product.stockStatus.status === StockStatus.AVAILABLE_SOON
        ? (
          <StockAlertView
            product={product}
            stockAlertLoading={stockAlertLoading}
            stockAlertError={stockAlertError}
            onSubmit={onStockAlert}
          />
        )
        : (
          <>
            {DeliveryPickup && (
              <DeliveryPickup
                product={product}
              />
            )}
            <ProductPageOptionsViewWrap
              product={product}
              onCartUpdate={onCartUpdate}
            />
            <div className="action-button-list">
              <DisplayBold20 className="hide-desktop">
                {product.priceText}
              </DisplayBold20>
              <ButtonList asList block reverseOnMobile>
                {addToCart}
                {addToWishList}
              </ButtonList>
            </div>
          </>
        )}
    </ProductPageActionViewLayout>
  );
};

ProductPageActionView.propTypes = {
  product: PropTypes.object,
  addToCart: PropTypes.element,
  addToWishList: PropTypes.element,
  onCartUpdate: PropTypes.func,
  DeliveryPickup: PropTypes.elementType,
  onEnquiryForm: PropTypes.func,
  stockAlertLoading: PropTypes.bool,
  stockAlertError: PropTypes.object,
  onStockAlert: PropTypes.func,
};

export const ProductPageDetailDescView = ({ product }) => {
  return (
    <ProductPageShortDescViewWrapper as="div">
      <TextBold14 as="strong" className="prod-page-desc-title">Vörulýsing</TextBold14>
      <MagentoHtml
        html={product.detailDesc}
      />
    </ProductPageShortDescViewWrapper>
  );
};

ProductPageDetailDescView.propTypes = {
  product: PropTypes.object,
};

export const BaseProductPageOptionsViewWrap = ({ product, onCartUpdate }) => {
  return (
    <ProductPageOptionsView
      product={product}
      onCartUpdate={onCartUpdate}
    />
  );
};

BaseProductPageOptionsViewWrap.propTypes = {
  product: PropTypes.object,
  onCartUpdate: PropTypes.func,
};

export const ProductPageOptionsViewWrap = withDependencySupport(BaseProductPageOptionsViewWrap, 'ProductPageOptionsViewWrap');
