import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Image } from 'react-datocms';
import { Breakpoint } from '@/roanuz/lib/css';

const DatoImageViewWrapper = styled.div`
`;

export const DatoImageView = ({ className, image }) => {
  return (
    <DatoImageViewWrapper className={`rz-dato-image-view ${className}`}>
      <Image data={image.responsiveImage} fadeInDuration={100} />
    </DatoImageViewWrapper>
  );
};

DatoImageView.propTypes = {
  image: PropTypes.object.isRequired,
  className: PropTypes.string,
};

const DatoResponsiveImageViewWrapper = styled.div`
  &.rz-dato-responsive-image-view {
    >.for-mobile, >.for-tablet {
      display: none;
    }
  }
  &.has-mobile-image {
    background: red;
    @media screen and (max-width: ${Breakpoint.sm}) {
      >.for-mobile {
        display: block;
      }
      >.for-desktop, >.for-tablet {
        display: none;
      }
    }
  }
  &.has-tablet-image {
    @media screen and (min-width: ${Breakpoint.lg}) {
      >.for-tablet {
        display: block;
      }
      >.for-desktop, >.for-mobile {
        display: none;
      }
    }
  }
`;

export const DatoResponsiveImageView = ({ className, item }) => {
  const classes = [
    'rz-dato-responsive-image-view',
    className,
  ];

  if (item.imageMobile) {
    classes.push('has-mobile-image');
  }
  if (item.imageTablet) {
    classes.push('has-tablet-image');
  }
  return (
    <DatoResponsiveImageViewWrapper
      className={classes.join(' ')}
    >
      {item.imageMobile && (
        <DatoImageView
          image={item.imageMobile}
          className="for-mobile"
        />
      )}
      {item.imageTablet && (
        <DatoImageView
          image={item.imageTablet}
          className="for-tablet"
        />
      )}
      <DatoImageView
        image={item.image}
        className="for-desktop"
      />
    </DatoResponsiveImageViewWrapper>
  );
};

DatoResponsiveImageView.propTypes = {
  className: PropTypes.string,
  item: PropTypes.objectOf(PropTypes.shape({
    image: PropTypes.object.isRequired,
    imageTablet: PropTypes.object,
    imageMobile: PropTypes.object,
  })).isRequired,
};
