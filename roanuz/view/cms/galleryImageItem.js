import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { DatoResponsiveImageView } from './datoImageView';

const GalleryImageItemWrapper = styled.div`
`;

export const GalleryImageItem = ({ item }) => {
  return (
    <GalleryImageItemWrapper className={item.cssClass}>
      {item.link
        ? (
          <Link href={item.link}>
            <a>
              <DatoResponsiveImageView item={item} />
            </a>
          </Link>
        )
        : (
          <>
            <DatoResponsiveImageView item={item} />
          </>
        )}
    </GalleryImageItemWrapper>
  );
};

GalleryImageItem.propTypes = {
  item: PropTypes.objectOf(PropTypes.shape({
    link: PropTypes.string,
    cssClass: PropTypes.string,
    image: PropTypes.object.isRequired,
    imageTablet: PropTypes.object,
    imageMobile: PropTypes.object,
  })).isRequired,
};
