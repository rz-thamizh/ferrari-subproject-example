import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import {
  DisplayBold20,
  LabelMedium12, DisplayBold30, Display20,
  TextMedium14,
} from '@/roanuz/typopgraphy';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
// import { ButtonList } from '@/roanuz/view/button';
import { RawHtmlView } from '@/roanuz/view/rawHtml';
import { ProductCardLayout, ProductCardDisplayMode, ProductCardHeadingLayout } from '../../layout/product/product';
import { ImageView, NoImageView } from '../image';
import { ProductLabelView, ProductPriceHeadView, LabelKind } from './label';
import { ProductEnergyLabelView } from './energyLabel';
import { ProductStockIndicatorView } from './stockIndicator';

const ProductCardViewWrapper = styled.div`
  > .rz-product-card {
    > .container-heading {
      .title {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;  
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sku {
        margin-top: ${(p) => ((p.displayMode === ProductCardDisplayMode.OneByThree) ? asRem(10) : asRem(2.8))};
        color: var(--color-disabled);
      }
    }

    > .container-content {
      > .container-price {
        .stock-indicator {
          margin-top: ${asRem(6)};
        }
      }
      > .container-action {
        .rz-button-atc {
          button {
            padding-right: ${asRem(14)};
            padding-left: ${asRem(14)};
            font-size: ${asRem(12)};
            line-height: ${asRem(16)};
            font-weight: 500;
            @media screen and (min-width: ${Breakpoint.sm}) {
              font-size: ${asRem(14)};
              line-height: ${asRem(20)};
            }
          }
        }

        .rz-button-atw.rz-button-wrapper {
          margin-left: ${asRem(16)};
        }

        .rz-button-atw {
          button {
            border-radius: 50%;
            & :hover {
              background-color: var(--color-border);
            }
          }
        }
      }
    }
  }

  .heading-conatiner {
    min-height: ${asRem(78)};
  }

  .container-price {
    .price {
      &.no-price {
        min-height: 32px;
        display: block;
      }
    }
  }
`;

export const ProductCardView = ({
  product, displayMode,
  addToCart, addToWishList,
  showShortDesc,
  className,
}) => {
  const stockIndicatorItems = [
    { status: product.stockStatus.onWeb, name: 'Vefur' },
    { status: product.stockStatus.onStore, name: 'Verslun' },
  ];

  const topOverlay = product.label && (
    <ProductLabelView
      text={product.label}
      kind={product.labelKind}
      product={product}
    />
  );

  const bottomOverlay = product.energyLabel && (
    <ProductEnergyLabelView product={product} />
  );

  const imageView = product.gallery.hasImage
    ? (
      <Link href={product.productLink} prefetch={false}>
        <a>
          <ImageView
            src={product.gallery.smallImage.url}
            alt={`Image of ${product.gallery.smallImage.label}`}
            showDefaultPlaceholder
            skipMediaUrlFix={!product.gallery.hasRzGalleryMeta}
          />
        </a>
      </Link>
    )
    : (
      <NoImageView />
    );

  const headingView = (
    <ProductCardHeadingLayout
      name={(
        <Display20 className="title">
          <Link href={product.productLink} prefetch={false}>
            <a className="plain hover-underline">
              {product.name}
            </a>
          </Link>
        </Display20>
      )}
      sku={(
        <LabelMedium12 as="div" className="sku">
          {product.sku}
        </LabelMedium12>
      )}
    />
  );

  const offerView = (<ProductPriceHeadView product={product} />);

  const priceView = (
    <>
      {(displayMode === ProductCardDisplayMode.OneByThree)
        ? (
          <DisplayBold30 as="strong" className={`price ${!product.hasPrice ? 'no-price' : ''}`}>
            {product.hasPrice && product.priceText}
          </DisplayBold30>
        )
        : (
          <DisplayBold20 as="strong" className={`price ${!product.hasPrice ? 'no-price' : ''}`}>
            {product.hasPrice && product.priceText}
          </DisplayBold20>
        )}
      <div className="stock-indicator">
        <ProductStockIndicatorView items={stockIndicatorItems} />
      </div>
    </>
  );

  const stockIndicatorView = (
    <div className="stock-indicator">
      <ProductStockIndicatorView items={stockIndicatorItems} />
    </div>
  );
  // const actionView = (
  //   <ButtonList
  //     reverse={displayMode === ProductCardDisplayMode.OneByThree}
  //   >
  //     {addToCart}
  //     {addToWishList}
  //   </ButtonList>
  // );

  let labelColor = null;

  if (product.labelKind && product.label) {
    switch (product.labelKind) {
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
  }

  return (
    <ProductCardViewWrapper displayMode={displayMode} className={className}>
      <ProductCardLayout
        imageOverlayTop={topOverlay}
        imageOverlayBottom={bottomOverlay}
        image={imageView}
        heading={headingView}
        labelColor={labelColor}
        shortDesc={showShortDesc && (
          <TextMedium14 as="div">
            <RawHtmlView
              html={product.shortDesc || ''}
            />
          </TextMedium14>
        )}
        offer={offerView}
        price={priceView}
        // action={actionView}
        displayMode={displayMode}
        cartAction={addToCart}
        wishListAction={addToWishList}
        stockIndicatorView={stockIndicatorView}
      />
    </ProductCardViewWrapper>
  );
};

ProductCardView.propTypes = {
  product: PropTypes.object,
  displayMode: ProductCardLayout.propTypes.displayMode,
  addToCart: PropTypes.element,
  addToWishList: PropTypes.element,
  showShortDesc: PropTypes.bool,
  className: PropTypes.string,
};
