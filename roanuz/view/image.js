import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Utils } from '@/lib/utils';
import { fixMediaUrl } from '@/roanuz/lib/utils';
import { StoreConfigContext } from '@/store/core/context';
import { StoreSpecificContent } from '@/store/core/storeUtils';

const ImageViewWrapper = styled.div`
  img {
    text-indent: -9999px;
    font-size: 0;
  }
`;

export const ImageView = ({
  src, alt, useMediaUrl, showDefaultPlaceholder = false,
  className = null, width, height, style, skipMediaUrlFix,
}) => {
  const storeConfigContext = useContext(StoreConfigContext);
  const { deafultImagePlaceholder } = StoreSpecificContent;
  let fullSrc = (useMediaUrl)
    ? `${Utils.mergePaths([storeConfigContext.storeConfig.base_media_url, src])}`
    : src;
  if (!skipMediaUrlFix) {
    fullSrc = fixMediaUrl(fullSrc);
  }
  const [showImage, setShowImage] = useState(true);

  const classes = [];
  if (!showImage) {
    classes.push('rz-hide');
  }

  if (className) {
    classes.push(className);
  }

  const formatStringToCamelCase = (str) => {
    const splitted = str.split('-');
    if (splitted.length === 1) return splitted[0];
    return (
      splitted[0]
      + splitted
        .slice(1)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join('')
    );
  };

  const getStyleObjectFromString = (str) => {
    const styleObj = {};

    if (str) {
      str.split(';').forEach((el) => {
        const [property, value] = el.split(':');
        if (!property) return;

        const formattedProperty = formatStringToCamelCase(property.trim());
        styleObj[formattedProperty] = value.trim();
      });
    }

    return styleObj;
  };

  return (
    <ImageViewWrapper
      className="rz-image-view"
    >
      {showImage ? (
        <img
          src={fullSrc}
          className={classes.join(' ')}
          alt={alt}
          width={width}
          height={height}
          style={getStyleObjectFromString(style)}
          onError={() => setShowImage(false)}
          onLoad={() => setShowImage(true)}
        />
      ) : (
        showDefaultPlaceholder && (
          <img
            src={deafultImagePlaceholder}
            alt="Missing Placeholder"
            className="placeholder"
          />
        )
      )}
    </ImageViewWrapper>
  );
};

ImageView.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  style: PropTypes.string,
  useMediaUrl: PropTypes.bool,
  showDefaultPlaceholder: PropTypes.bool,
  className: PropTypes.string,
  skipMediaUrlFix: PropTypes.bool,
};

export const NoImageView = ({ alt }) => {
  const { deafultImagePlaceholder } = StoreSpecificContent;
  return (
    <ImageView
      src={deafultImagePlaceholder}
      alt={alt || 'Image Missing'}
    />
  );
};

NoImageView.propTypes = {
  alt: PropTypes.string,
};
