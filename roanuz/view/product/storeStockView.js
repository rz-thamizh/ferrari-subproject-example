import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  TextBold14,
  TextMedium14,
} from '@/roanuz/typopgraphy';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { ProductStockIndicatorView } from './stockIndicator';

export const BaseStoreStocksViewWrapper = styled.div`
display: flex;
justify-content: space-between;
>section {
  &:last-child {
    margin-bottom: 0;
  }
}
@media screen and (min-width: ${Breakpoint.sm}) {
  flex-direction: column;
  >section {
    margin-bottom: ${asRem(34)};
  }
}
`;

export const StoreStocksView = ({
  storesList,
  showPieceStores,
}) => {
  return (
    <StoreStocksViewWrapper>
      {storesList && storesList.length > 0 && (
        <section>
          <TextBold14 as="strong">Lagerstaða</TextBold14>
          <ProductStockIndicatorView items={storesList} asList />
        </section>
      )}

      {showPieceStores && showPieceStores.length > 0 && (
        <section className="show-piece-container">
          <TextBold14 as="strong">Sýningareintök</TextBold14>
          {showPieceStores.map((storeName, i) => (
            <TextMedium14 key={i}>{storeName.label}</TextMedium14>
          ))}
        </section>
      )}

    </StoreStocksViewWrapper>
  );
};

StoreStocksView.propTypes = {
  storesList: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    yes: PropTypes.bool,
    isAvailable: PropTypes.bool,
  })),
  showPieceStores: PropTypes.arrayOf(PropTypes.object),
};

export const StoreStocksViewWrapper = withDependencySupport(BaseStoreStocksViewWrapper, 'StoreStocksViewWrapper');
