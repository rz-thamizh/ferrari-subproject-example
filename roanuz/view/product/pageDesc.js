import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { ProductPageDescLayout } from '@/roanuz/layout/product/pageDesc';
import { ProductEnergyLabelView } from './energyLabel';
import { StoreStocksView } from './storeStockView';
import { ProductPageReturnDaysView, ProductPageShortDescView } from './pageComp';
import { StockStatus } from './models/stock';

export const BaseProductPageDescViewWrapper = styled(ProductPageDescLayout)`
`;

export const BaseProductPageDescView = ({ product, DeliveryPickup }) => {
  return (
    <ProductPageDescViewWrapper
      shortDesc={product.shortDesc && (
        <ProductPageShortDescView product={product} />
      )}
      energyLabel={product.energyLabel && (
        <ProductEnergyLabelView product={product} labelAsButton />
      )}
      storesStatus={(
        <StoreStocksView
          storesList={product.stockStatus.storesStatus}
          showPieceStores={product.stockStatus.showPieceStores}
        />
      )}
      returnDays={(
        <ProductPageReturnDaysView product={product} />
      )}
      delivery={(DeliveryPickup && (product.stockStatus.status !== StockStatus.AVAILABLE_SOON)) && (
        <DeliveryPickup
          product={product}
        />
      )}
    />
  );
};

BaseProductPageDescView.propTypes = {
  product: PropTypes.object,
  DeliveryPickup: PropTypes.elementType,
};
export const ProductPageDescViewWrapper = withDependencySupport(BaseProductPageDescViewWrapper, 'ProductPageDescViewWrapper');
export const ProductPageDescView = withDependencySupport(BaseProductPageDescView, 'ProductPageDescView');
