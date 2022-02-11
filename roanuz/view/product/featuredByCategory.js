import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { DisplayBold18 } from '@/roanuz/typopgraphy';
import { ProductCardLayout } from '@/roanuz/layout/product/product';
import { ProductGrid, ProductSliderWithLoader } from '@/roanuz/controller/product/list';
import { asRem } from '@/roanuz/lib/css';

const FeaturedByCategoryViewWrapper = styled.div`
>.title-section {
  margin-bottom: ${asRem(40)};
}
>.link-section {
  text-align: right;
  margin-top: ${asRem(40)};

  a {
    font-weight: 500;
    font-style: normal;
  }
}
`;

export const FeaturedByCategoryView = ({
  title,
  link,
  linkText,
  products,
  displayMode,
  carousel,
}) => {
  const hasProducts = products && products.length;
  if (!hasProducts) {
    return null;
  }
  return (
    <FeaturedByCategoryViewWrapper>
      {title && (
        <div className="title-section">
          <DisplayBold18 className="with-decorated-border" as="h3">
            {title}
          </DisplayBold18>
        </div>
      )}
      {carousel
        ? (
          <ProductSliderWithLoader
            products={products}
            displayMode={displayMode}
          />
        )
        : (
          <ProductGrid
            withFlexScroll={carousel}
            displayMode={displayMode}
            products={products}
          />
        )}

      {link && (
        <div className="link-section">
          <Link href={link}>
            <a alt="More products">{linkText}</a>
          </Link>
        </div>
      )}
    </FeaturedByCategoryViewWrapper>
  );
};

FeaturedByCategoryView.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
  linkText: PropTypes.string,
  products: PropTypes.arrayOf(PropTypes.object),
  displayMode: ProductCardLayout.propTypes.displayMode,
  carousel: PropTypes.bool,
};
