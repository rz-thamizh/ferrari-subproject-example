import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ReactComponent as RefurbishedIcon } from '@/roanuz/view/imgs/RefurbishedIcon.svg';
import { LabelMedium12, TextMedium14, Text16 } from '@/roanuz/typopgraphy';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { SVGIcon } from '../icon';

export const LabelKind = {
  Label: 'Label',
  New: 'New',
  Discount: 'Discount',
  Sale: 'Sale',
  Refurbished: 'Refurbished',
};

export const BaseProductLabelViewWrapper = styled.div`
  padding: ${asRem(2)} ${asRem(6)};
  font-size: ${asRem(12)};
  line-height: ${asRem(16)};
  @media screen and (min-width: ${Breakpoint.md}) {
    padding: ${asRem(4)} ${asRem(10)};
  }
  border-radius: ${asRem(2)};
  background-color: var(--color-indicator);

  &.label-green {
    background-color: var(--color-indicator-green);
  }

  &.label-purple {
    background-color: var(--color-refurbished);
    color: var(--color-text-rev);
  }

  &.rz-product-label {
    >.rz-svg-icon, >span {
      vertical-align: middle;
    }
    >.rz-svg-icon {
      padding-right: ${asRem(5)};
    }
  }
`;

export const BaseProductLabelView = ({ kind, text }) => {
  let labelColor = null;

  switch (kind) {
    case LabelKind.New:
      labelColor = 'green';
      break;
    case LabelKind.Refurbished:
      labelColor = 'purple';
      break;
    default:
      labelColor = 'yellow';
      break;
  }

  const classes = [
    'rz-product-label',
    `label-${labelColor}`,
  ].join(' ');

  if (kind === LabelKind.Refurbished) {
    return (
      <ProductLabelViewWrapper className={classes}>
        <SVGIcon heightPx={14}>
          <RefurbishedIcon />
        </SVGIcon>
        <LabelMedium12>{text}</LabelMedium12>
      </ProductLabelViewWrapper>
    );
  }

  return (
    <ProductLabelViewWrapper className={classes}>
      <LabelMedium12>{text}</LabelMedium12>
    </ProductLabelViewWrapper>
  );
};

BaseProductLabelView.propTypes = {
  kind: PropTypes.oneOf(Object.keys(LabelKind)),
  text: PropTypes.string.isRequired,
};

export const BaseProductPriceHeadViewWrapper = styled.div`
  > .discount {
    color: var(--color-focus);
  }

  > .regular-price, > .variable-price-label {
    color: var(--color-disabled);
  }
`;

export const BaseProductPriceHeadView = ({ className, product }) => {
  const hasSale = product.onSale || product.onDiscount;
  return (
    <BaseProductPriceHeadViewWrapper className={className}>
      {hasSale && (
        <>
          {product.discountText && (
            <TextMedium14 as="span" className="discount">
              {/* {product.hasDiscountAmount ? 'Sparar ' : '- ' }
              {product.discountText} */}
              {`- ${product.discountText}`}
            </TextMedium14>
          )}
          <TextMedium14 as="span" className="regular-price">
            &nbsp; &nbsp;
            {product.hasVariablePrice && 'Frá '}
            <strike>{product.regPriceText}</strike>
          </TextMedium14>
        </>
      )}
      {((!hasSale) && product.hasVariablePrice) && (
        <TextMedium14 as="div" className="variable-price-label">
          Frá
        </TextMedium14>
      )}
    </BaseProductPriceHeadViewWrapper>
  );
};

BaseProductPriceHeadView.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object,
};

const BaseProductPriceHeadViewWrapper2 = styled(BaseProductPriceHeadViewWrapper)`
  .regular-price {
    color: var(--color-error);
  }

  .discount {
    color: var(--color-text-2);
  }
`;

export const BaseProductPriceHeadView2 = ({ className, product }) => {
  const hasSale = product.onSale || product.onDiscount;
  return (
    <BaseProductPriceHeadViewWrapper2 className={className}>
      {hasSale && (
        <>
          {product.discountText && (
            <Text16 as="span" className="discount">
              {product.hasDiscountAmount ? `Sparið ${product.discountText}` : `${product.discountText} afsláttur` }
            </Text16>
          )}
          <Text16 as="span" className="regular-price">
            &nbsp; &nbsp;
            {product.hasVariablePrice && 'Frá '}
            <strike>{product.regPriceText}</strike>
          </Text16>
        </>
      )}
      {((!hasSale) && product.hasVariablePrice) && (
        <Text16 as="div" className="variable-price-label">
          Frá
        </Text16>
      )}
    </BaseProductPriceHeadViewWrapper2>
  );
};

BaseProductPriceHeadView2.propTypes = {
  ...BaseProductPriceHeadView,
};

export const ProductLabelViewWrapper = withDependencySupport(BaseProductLabelViewWrapper, 'ProductLabelViewWrapper');
export const ProductLabelView = withDependencySupport(BaseProductLabelView, 'ProductLabelView');
export const ProductPriceHeadView = withDependencySupport(BaseProductPriceHeadView, 'ProductPriceHeadView');
