import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import {
  Text16, DisplayBold24,
  LabelMedium12, TextBold16,
} from '@/roanuz/typopgraphy';
import { asRem } from '@/roanuz/lib/css';
import { ProductPreviewLayout, ProductPreviewDisplayMode } from '../../layout/product/preview';
import { ImageView, NoImageView } from '../image';

const ProductPreviewViewWrapper = styled.div`
  > .rz-product-preview {
    .container-heading {
      .sku {
        margin-top: ${(p) => ((p.displayMode === ProductPreviewDisplayMode.ThreeCol) ? asRem(6) : asRem(8))};
        color: var(--color-disabled);
      }
    }
  }
`;

export const ProductPreviewView = ({
  product, displayMode, actionView, shouldLinkTitle = true,
  hidePrice, quantityUpdate, hideQuantity, secondaryActionView,
}) => {
  const infredDisplayMode = displayMode || ProductPreviewDisplayMode.ThreeCol;
  const imageView = product.gallery && product.gallery.hasImage
    ? (
      <ImageView
        src={product.gallery.smallImage.url}
        alt={`Image of ${product.gallery.smallImage.label}`}
        showDefaultPlaceholder
        skipMediaUrlFix={!product.gallery.hasRzGalleryMeta}
      />
    )
    : (
      <NoImageView />
    );

  const headingView = (
    <div>
      <Text16 className="title">
        {shouldLinkTitle ? (
          <Link href={product.productLink}>
            <a className="plain hover-underline">
              {product.name}
            </a>
          </Link>
        ) : (
          product.name
        )}
      </Text16>
      <LabelMedium12 as="div" className="sku">
        {product.sku}
      </LabelMedium12>
    </div>
  );

  const priceView = (
    <>
      {(infredDisplayMode === ProductPreviewDisplayMode.ThreeCol)
        ? (
          <TextBold16 as="strong" className="price">
            {product.priceText}
          </TextBold16>
        )
        : (
          <DisplayBold24 as="strong" className="price">
            {product.priceText}
          </DisplayBold24>
        )}
    </>
  );

  const quantityTextView = (
    <LabelMedium12 className="quantity">
      {product.quantityText}
    </LabelMedium12>
  );

  return (
    <ProductPreviewViewWrapper displayMode={infredDisplayMode}>
      <ProductPreviewLayout
        image={imageView}
        heading={headingView}
        price={(!hidePrice) ? priceView : null}
        displayMode={infredDisplayMode}
        action={actionView}
        seondaryAction={secondaryActionView}
        quantityUpdate={quantityUpdate}
        quantity={(!hideQuantity) ? quantityTextView : null}
      />
    </ProductPreviewViewWrapper>
  );
};

ProductPreviewView.propTypes = {
  product: PropTypes.object,
  displayMode: ProductPreviewLayout.propTypes.displayMode,
  actionView: PropTypes.element,
  shouldLinkTitle: PropTypes.bool,
  hidePrice: PropTypes.bool,
  quantityUpdate: PropTypes.element,
  hideQuantity: PropTypes.bool,
  secondaryActionView: PropTypes.element,
};
