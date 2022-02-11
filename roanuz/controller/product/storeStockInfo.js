import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { StoreStocksView } from '@/roanuz/view/product/storeStockView';
import { useQuery } from '@apollo/client';
import { multiStockInventoryStatus } from '@/store/product/product.graphql';

const StoreStocksControllerWrapper = styled.div`
`;

export const StoreStocksController = ({ product }) => {
  const { loading, data, error } = useQuery(multiStockInventoryStatus, {
    variables: { productSKU: product.sku },
  });

  if (error) {
    console.log('Error loading Stocks Info', error);
    return null;
  }

  let stockStatusItems = {};
  const storesList = [];

  if (data) {
    stockStatusItems = data.multiStockInventoryStatus;
    let wareHouseIndex = -1;
    let isAvailable = false;
    stockStatusItems.sources.forEach((store, index) => {
      const stockInfo = {
        name: store.name,
        code: store.code,
        yes: (store.stock_status === 'IN_STOCK'),
        isAvailable: false,
      };
      if (store.code === 'warehouse') {
        wareHouseIndex = index;
      }
      if (stockInfo.yes) {
        isAvailable = true;
      }
      storesList.push(stockInfo);
    });
    if (wareHouseIndex > -1 && storesList.length > 0
      && (!storesList[wareHouseIndex].yes) && isAvailable) {
      storesList[wareHouseIndex].isAvailable = true;
    }
  }

  return (
    <StoreStocksControllerWrapper>
      <StoreStocksView
        loading={loading}
        storesList={storesList}
        showPieceStores={stockStatusItems.show_piece_stores}
      />
    </StoreStocksControllerWrapper>
  );
};

StoreStocksController.propTypes = {
  product: PropTypes.object.isRequired,
};
