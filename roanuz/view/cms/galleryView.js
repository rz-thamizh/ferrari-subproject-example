import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { SweetSlider } from '@/roanuz/view/sweetSlider/sweetSlider';
import { GalleryImageItem } from './galleryImageItem';

const GalleryViewWrapper = styled.div`
  ${(p) => p.padded && css`
    margin-top: ${asRem(40)};
  `}
  &.nospace {
    margin-top: 0;
  }
`;

export const GalleryView = ({
  className,
  padded,
  spacingPx,
  mobileSlides,
  tabletSlides,
  desktopSlides,
  gallery,
}) => {
  const space = spacingPx === undefined ? '20px' : `${spacingPx}px`;
  const mobileCount = mobileSlides || 1;
  const tabletCount = tabletSlides || mobileCount || 1;
  const desktopCount = desktopSlides || mobileCount || 1;
  const responsive = {
    xs: { columns: mobileCount, showPageArrows: false, showPageDots: true },
    md: { columns: tabletCount, showPageArrows: false, showPageDots: true },
    lg: { columns: desktopCount, showPageArrows: true, showPageDots: false },
  };

  const defaultConfig = {
    ...responsive.xs,
  };

  const items = gallery.images.map((item) => (
    <GalleryImageItem
      item={item}
    />
  ));
  return (
    <GalleryViewWrapper
      padded={padded}
      className={`rz-image-list-container ${className}`}
    >
      <SweetSlider
        {...defaultConfig}
        responsive={responsive}
        items={items}
        showPageDots
        showProgressBar={false}
        space={space}
      />
    </GalleryViewWrapper>
  );
};

GalleryView.propTypes = {
  className: PropTypes.string,
  mobileSlides: PropTypes.number,
  tabletSlides: PropTypes.number,
  desktopSlides: PropTypes.number,
  spacingPx: PropTypes.number,
  padded: PropTypes.bool,
  gallery: PropTypes.objectOf(PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.shape({
      ...GalleryImageItem.PropTypes,
    })),
  })),
};
