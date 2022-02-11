import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';

import { Display30, TextMedium14, TextMedium16 } from '@/roanuz/typopgraphy';
import { ProductPageLayout } from '@/roanuz/layout/product/page';
import { ReactComponent as RefurbishedFullIcon } from '@/roanuz/view/imgs/RefurbishedFullIcon.svg';
import { SVGIcon } from '@/roanuz/view/icon';
import { BreadcrumbView, buildProductBreadcrumbLinks } from '@/roanuz/view/breadcrumb';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { ImageView } from '../image';
import { ProductGalleryView } from './pageGallery';
import { ProductPageDescView } from './pageDesc';
import { ProductSidebarView } from './pageSidebar';
import { ProductPageDetailViewGroup } from './pageDetailViewGroup';
import { ProductPageRelatedItemsView } from './productRelated';

const ProductPageLayoutWrapper = styled(ProductPageLayout)`
  .page-title {
    .sku {
      color: var(--color-disabled);
    }
  }
`;

const RefurbishedNotesWrapper = styled.div`
  padding: ${asRem(10)} ${asRem(30)};
  display: flex;
  background-color: var(--color-refurbished-bg);

  .rz-svg-icon {
    display: block;
    margin-top: auto;
    margin-bottom: auto;
    color: var(--color-refurbished);
  }


  flex-direction: column;
  @media screen and (min-width: ${Breakpoint.sm}) {
    flex-direction: row;

    >p {
      padding-left: ${asRem(40)};
    }
  }
`;

export const ProductPageView = ({
  product,
  productBrand,
  tabIndexStart,
  widgets,
  addToCart,
  addToWishList,
  onCartUpdate,
  SiminnLoan,
  DeliveryPickup,
  onEnquiryForm,
  stockAlertLoading,
  stockAlertError,
  onStockAlert,
  specificationsList,
}) => {
  const tabIndex = tabIndexStart || 5;
  const breadcrumbLinks = buildProductBreadcrumbLinks({
    product,
  });

  const breadcrumb = (
    <BreadcrumbView links={breadcrumbLinks} />
  );

  const title = (
    <div>
      <Display30 as="h1">{product.name}</Display30>
      <TextMedium14 className="sku">{product.sku}</TextMedium14>
    </div>
  );

  const notice = product.isRefurbished && (
    <RefurbishedNotesWrapper>
      <SVGIcon heightPx={26}>
        <RefurbishedFullIcon />
      </SVGIcon>
      {product.refurbishedNotes && (
        <TextMedium16 className="desc">{product.refurbishedNotes}</TextMedium16>
      )}
    </RefurbishedNotesWrapper>
  );

  let titleRight = null;
  if (productBrand) {
    titleRight = (
      <div>
        <Link href={productBrand.link}>
          <a alt="Manufacturer's Products">
            <ImageView
              src={productBrand.imageUrl}
              alt={`${productBrand.name}`}
            />
          </a>
        </Link>
      </div>
    );
  }

  const gallery = (
    <ProductGalleryView product={product} tabIndexStart={tabIndex + 10} />
  );

  const desc = (
    <ProductPageDescView
      product={product}
      tabIndexStart={tabIndex + 5}
      DeliveryPickup={DeliveryPickup}
    />
  );

  const sidebar = (
    <ProductSidebarView
      product={product}
      tabIndexStart={tabIndex + 5}
      addToCart={addToCart}
      addToWishList={addToWishList}
      onCartUpdate={(...args) => {
        if (onCartUpdate) {
          onCartUpdate(...args);
        }
        return null;
      }}
      SiminnLoan={SiminnLoan}
      DeliveryPickup={DeliveryPickup}
      onEnquiryForm={onEnquiryForm}
      stockAlertLoading={stockAlertLoading}
      stockAlertError={stockAlertError}
      onStockAlert={onStockAlert}
    />
  );

  const details = (
    <ProductPageDetailViewGroup
      product={product}
      specificationsList={specificationsList}
    />
  );

  const relatedItems = (
    <ProductPageRelatedItemsView
      product={product}
    />
  );

  return (
    <ProductPageLayoutWrapper
      breadcrumb={breadcrumb}
      title={title}
      notice={notice}
      titleRight={titleRight}
      gallery={gallery}
      desc={desc}
      details={details}
      relatedItems={relatedItems}
      sidebar={sidebar}
      widgets={widgets}
      product={product}
    />
  );
};

ProductPageView.propTypes = {
  product: PropTypes.object,
  productBrand: PropTypes.object,
  tabIndexStart: PropTypes.number,
  widgets: PropTypes.element,
  addToCart: PropTypes.element,
  addToWishList: PropTypes.element,
  onCartUpdate: PropTypes.func,
  SiminnLoan: PropTypes.elementType,
  DeliveryPickup: PropTypes.elementType,
  onEnquiryForm: PropTypes.func,
  stockAlertLoading: PropTypes.bool,
  stockAlertError: PropTypes.object,
  onStockAlert: PropTypes.func,
  specificationsList: PropTypes.object,
};
