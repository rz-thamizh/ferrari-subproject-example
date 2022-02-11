import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { ProductPageSidebarLayout } from '@/roanuz/layout/product/pageSidebar';
import { useRouter } from 'next/router';
import { StockStatus } from './models/stock';

import {
  ProductPageActionView,
  ProductPagePriceView,
  ProductPageSiminnLoanView,
  ProductPageShortDescView,
  ProductPageReturnDaysView,
  ProductPageOptionsView,
  ProductPageDetailDescView,
} from './pageComp';
import { ProductEnergyLabelView } from './energyLabel';
import { StoreStocksView } from './storeStockView';

export const ProductSidebarViewWrapper = styled(ProductPageSidebarLayout)`
`;

export const BaseProductSidebarView = ({
  product,
  // eslint-disable-next-line no-unused-vars
  tabIndexStart,
  addToCart, addToWishList,
  onCartUpdate,
  SiminnLoan,
  DeliveryPickup,
  onEnquiryForm,
  stockAlertLoading,
  stockAlertError,
  onStockAlert,
}) => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== 'undefined' && router.asPath.includes('#specification')) {
      const descEle = document.getElementById('specification');
      if (descEle) {
        if (descEle.querySelector('.closed')) {
          descEle.querySelector('.closed').click();
        }
        descEle.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  return (
    <ProductSidebarViewWrapper
      hasCrossSellProducts={product.crossSellAsOption || product.crosssellProducts.length}
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
      price={(
        <ProductPagePriceView product={product} />
      )}
      loan={(
        <ProductPageSiminnLoanView product={product} SiminnLoan={SiminnLoan} />
      )}
      options={(
        <ProductPageOptionsView
          product={product}
          onCartUpdate={onCartUpdate}
        />
      )}
      actions={(
        <ProductPageActionView
          product={product}
          addToCart={addToCart}
          addToWishList={addToWishList}
          onCartUpdate={onCartUpdate}
          SiminnLoan={SiminnLoan}
          DeliveryPickup={DeliveryPickup}
          onEnquiryForm={onEnquiryForm}
          stockAlertLoading={stockAlertLoading}
          stockAlertError={stockAlertError}
          onStockAlert={onStockAlert}
        />
      )}
      detailDesc={product.detailDesc && (
        <ProductPageDetailDescView product={product} />
      )}
    />
  );
};

BaseProductSidebarView.propTypes = {
  product: PropTypes.object,
  tabIndexStart: PropTypes.number,
  addToCart: PropTypes.element,
  addToWishList: PropTypes.element,
  onCartUpdate: PropTypes.func,
  SiminnLoan: PropTypes.elementType,
  DeliveryPickup: PropTypes.elementType,
  onEnquiryForm: PropTypes.func,
  stockAlertLoading: PropTypes.bool,
  stockAlertError: PropTypes.object,
  onStockAlert: PropTypes.func,
};

export const ProductSidebarView = withDependencySupport(BaseProductSidebarView, 'ProductSidebarView');
