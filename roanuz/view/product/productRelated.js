import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ProductSliderWithLoader } from '@/roanuz/controller/product/list';
import { ProductCardDisplayMode } from '@/roanuz/layout/product/product';
import { DisplayBold18 } from '@/roanuz/typopgraphy';
import { asRem } from '@/roanuz/lib/css';

const ProductPageRelatedItemsViewWrapper = styled.div`
.related-products-list {
  margin-bottom: ${asRem(60)};

  >h4 {
    padding-bottom: ${asRem(10)};
    border-bottom: 1px solid;
  }

  >div {
    padding-top: ${asRem(40)};
  }

  &:last-child {
    margin-bottom: 0;
  }
}
`;

export const ProductPageRelatedItemsView = ({ product }) => {
  return (
    <ProductPageRelatedItemsViewWrapper>
      {product.upsellProducts && product.upsellProducts.length > 0 && (
        <div className="related-products-list">
          <DisplayBold18>Upsell Products</DisplayBold18>
          <ProductSliderWithLoader
            products={product.upsellProducts}
            displayMode={ProductCardDisplayMode.OneBySix}
          />
        </div>
      )}
      {(!product.crossSellAsOption)
        && product.crosssellProducts
        && product.crosssellProducts.length > 0 && (
        <div className="related-products-list">
          <DisplayBold18>Cross Sell Products</DisplayBold18>
          <ProductSliderWithLoader
            products={product.crosssellProducts}
            displayMode={ProductCardDisplayMode.OneBySix}
          />
        </div>
      )}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="related-products-list">
          <DisplayBold18>Tengdar vörur</DisplayBold18>
          <ProductSliderWithLoader
            products={product.relatedProducts}
            displayMode={ProductCardDisplayMode.OneBySix}
          />
        </div>
      )}
    </ProductPageRelatedItemsViewWrapper>
  );
};

ProductPageRelatedItemsView.propTypes = {
  product: PropTypes.object,
};
