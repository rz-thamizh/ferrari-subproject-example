import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { useQuery } from '@apollo/client';
import { ProductEneryLabelImageQuery } from '@/store/product/product.graphql';
import { DailogView } from '@/roanuz/view/dialog';
import LoadingView from '@/components/utils/LoadingView';
import ErrorView from '@/components/utils/ErrorView';
import { LabelMedium12 } from '@/roanuz/typopgraphy';
import Link from 'next/link';
import { Button } from '@/roanuz/view/button';
import { ImageView } from '../image';
import { prepareGalleryData } from './model';

const ProductEnergyLabelViewWrapper = styled.div`
  > .label-name {
    margin-top: ${asRem(6)};
    background-color: #fff;
    border-radius: ${asRem(3)};
    padding: ${asRem(2)} ${asRem(5)};
    >button {
      padding: 0;
      color: var(--color-text);
      &:hover {
        color: var(--color-button);
      }
    }
  }

  > .rz-image-view {
    height: ${asRem(24)};
  }

  >.energy-label-btn {
    cursor: pointer;
  }
`;

const EnergyLabelImageWrapper = styled.div`
  height: 100%;
  .debug-loading-view .row >div {
    transform: initial !important;
  }
  > .rz-image-view {
    height: 100%;
    text-align: center;
    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
`;

export const EnergyLabelDailogView = ({ product }) => {
  const { loading, error, data: energyLabelData } = useQuery(ProductEneryLabelImageQuery, {
    variables: { urlKey: product.productUrlKey },
    skip: product.gallery.hasEnergyLabel,
  });
  let { gallery } = product;
  if (energyLabelData && energyLabelData.products) {
    const productItem = energyLabelData.products.items[0];
    const raw = {
      sku: product.sku,
      ...productItem,
    };
    gallery = prepareGalleryData(raw);
  }
  const noImageText = {
    message: 'Mynd vantar',
  };
  return (
    <EnergyLabelImageWrapper>
      {((!energyLabelData) && loading) && (<LoadingView />)}
      {((!energyLabelData) && error) && (<ErrorView error={error} />)}
      {(!loading && !error && !gallery) && (<ErrorView error={noImageText} />)}
      {gallery && (
        <ImageView
          src={gallery && gallery.energyLabelImage && gallery.energyLabelImage.url}
          alt={`${product.energyLabel}`}
          skipMediaUrlFix={!product.gallery.hasRzGalleryMeta}
          showDefaultPlaceholder
        />
      )}
    </EnergyLabelImageWrapper>
  );
};

EnergyLabelDailogView.propTypes = {
  product: PropTypes.object.isRequired,
};

export const ProductEnergyLabelView = ({ product, labelAsButton = false }) => {
  const [showEnergyLabelImage, setShowEnergyLabelImage] = useState(false);
  const scrollToSpecs = () => {
    const descEle = document.getElementById('specification');
    if (descEle) {
      if (descEle.querySelector('.closed')) {
        descEle.querySelector('.closed').click();
      }
      descEle.scrollIntoView();
    }
  };
  return (
    <ProductEnergyLabelViewWrapper>
      <DailogView
        show={showEnergyLabelImage}
        containerWidth="450px"
        titleText="Orkunotkun"
        showClose
        onClose={() => setShowEnergyLabelImage(false)}
      >
        <EnergyLabelDailogView product={product} />
      </DailogView>
      <div
        onClick={() => setShowEnergyLabelImage(true)}
        onKeyPress={() => setShowEnergyLabelImage(true)}
        role="button"
        tabIndex="0"
        className="energy-label-btn"
      >
        <ImageView
          src={product.energyLabelIcon}
          alt={`${product.energyLabel}`}
        />
      </div>
      <div className="label-name">
        {labelAsButton ? (
          <Button ariaLabel="Tæknilýsing" className="" mode="primary" noborder onClick={scrollToSpecs}>
            <LabelMedium12 as="span">Vöruupplýsingablað</LabelMedium12>
          </Button>
        ) : (
          <Link href={`${product.productLink}#specification`} prefetch={false}>
            <a alt="Links to Um Att" className="plain">
              <LabelMedium12 as="div">Vöruupplýsingablað</LabelMedium12>
            </a>
          </Link>
        )}
      </div>
    </ProductEnergyLabelViewWrapper>
  );
};

ProductEnergyLabelView.propTypes = {
  product: PropTypes.object.isRequired,
  labelAsButton: PropTypes.bool,
};
