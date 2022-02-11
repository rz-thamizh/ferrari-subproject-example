import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { ImageWidgetView } from '@/roanuz/view/catalog/imageView';
import { SweetSlider } from '@/roanuz/view/sweetSlider/sweetSlider';

const ImageListWrapper = styled.div`
  ${(p) => p.padded && css`
    margin-top: ${asRem(40)};
  `}
  &.nospace {
    margin-top: 0;
  }
`;

export const ImageListView = ({
  className,
  padded,
  spacingPx,
  mobileSlides,
  tabletSlides,
  desktopSlides,
  slides,
}) => {
  const space = spacingPx === undefined ? '20px' : `${spacingPx}px`;
  const mobileCount = mobileSlides || 0;
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

  const items = slides.map((slide) => (
    <ImageWidgetView
      imageUrl={slide.image_url}
      tabletImageUrl={slide.image_tablet_url}
      mobileImageUrl={slide.image_mobile_url}
      link={slide.link}
      title={slide.title}
    />
  ));

  return (
    <ImageListWrapper padded={padded} className={`rz-image-list-container ${className}`}>
      <SweetSlider
        {...defaultConfig}
        responsive={responsive}
        items={items}
        showPageDots
        showProgressBar={false}
        space={space}
      />
    </ImageListWrapper>
  );
};

ImageListView.propTypes = {
  className: PropTypes.string,
  mobileSlides: PropTypes.number,
  tabletSlides: PropTypes.number,
  desktopSlides: PropTypes.number,
  spacingPx: PropTypes.number,
  padded: PropTypes.bool,
  slides: PropTypes.arrayOf(PropTypes.shape({
    image_url: PropTypes.string,
    image_tablet_url: PropTypes.string,
    image_mobile_url: PropTypes.string,
    link: PropTypes.string,
    title: PropTypes.string,
  })),
};
