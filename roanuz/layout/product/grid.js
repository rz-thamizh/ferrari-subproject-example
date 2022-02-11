import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { ProductCardLayout, ProductCardDisplayMode } from './product';

const ProductGridLayoutWrapper = styled.div`
  display: grid;
  grid-row-gap: ${asRem(30)};
  --size-product-card-16-width: 100%;
  grid-column-gap: ${asRem(15)};

  ${(p) => (p.displayMode === ProductCardDisplayMode.OneByTwo) && css`
    margin-top: ${asRem(60)};
    grid-template-columns: repeat(1, 1fr);
  `}

  ${(p) => (p.displayMode === ProductCardDisplayMode.OneByFour) && css`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${(p) => (p.displayMode === ProductCardDisplayMode.OneBySix) && css`
    grid-template-columns: repeat(2, 1fr);
  `}

  @media screen and (min-width: ${Breakpoint.md}) {
    ${(p) => (p.displayMode === ProductCardDisplayMode.OneByFour) && css`
      grid-template-columns: repeat(3, 1fr);
    `}
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    grid-column-gap: ${asRem(40)};
    ${(p) => (p.displayMode === ProductCardDisplayMode.OneBySix) && css`
      grid-template-columns: repeat(3, 1fr);
      grid-column-gap: ${asRem(20)};
    `}
    grid-row-gap: ${asRem(40)};

    ${(p) => (p.displayMode === ProductCardDisplayMode.OneByThree) && css`
      grid-template-columns: repeat(2, 1fr);
    `}
  }

  @media screen and (min-width: ${Breakpoint.lg}) {
    grid-template-columns: repeat(5, 1fr);
    grid-row-gap: ${asRem(60)};

    ${(p) => (p.displayMode === ProductCardDisplayMode.OneByFour) && css`
      grid-template-columns: repeat(4, 1fr);
    `}

    ${(p) => (p.displayMode === ProductCardDisplayMode.OneByThree) && css`
      grid-template-columns: repeat(3, 1fr);
    `}

    ${(p) => (p.displayMode === ProductCardDisplayMode.OneByTwo) && css`
      grid-template-columns: repeat(2, 1fr);
    `}
  }

  ${(p) => p.autoFit && css`
    // grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    grid-auto-flow: dense;
  `}

  ${(p) => p.withBorder && css`
    grid-column-gap: 0 !important;
    >div {
      padding-bottom: var(--product-grid-padding-bottom);
      border-bottom: ${asRem(1)} solid var(--color-disabled-3);

      @media screen and (min-width: ${Breakpoint.lg}) {
        padding-right: ${asRem(30)};
      }
    }
  `}

  ${(p) => p.withFlexScroll && css`
    display: flex;
    overflow: scroll;
  `}
`;

export const ProductGridLayout = ({
  children,
  autoFit,
  withBorder,
  withFlexScroll,
  displayMode,
  className,
}) => {
  return (
    <ProductGridLayoutWrapper
      className={`rz-products-grid ${className}`}
      autoFit={autoFit}
      withBorder={withBorder}
      withFlexScroll={withFlexScroll}
      displayMode={displayMode}
    >
      {children}
    </ProductGridLayoutWrapper>
  );
};

ProductGridLayout.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  autoFit: PropTypes.bool,
  withBorder: PropTypes.bool,
  withFlexScroll: PropTypes.bool,
  displayMode: ProductCardLayout.propTypes.displayMode,
  className: ProductCardLayout.string,
};
