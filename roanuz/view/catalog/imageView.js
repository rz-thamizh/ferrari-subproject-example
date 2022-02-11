import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { TextMedium16 } from '@/roanuz/typopgraphy';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { fixMediaUrl } from '@/roanuz/lib/utils';

const ImageViewWrapper = styled.div`
  a {
    display: flex;
    flex-flow: column;
    align-items: center;
    text-align: center;
    color: var(--color-text);
    picture, img {
      max-width: 100%;
    }
    p {
      margin-top: ${asRem(14)};
      margin-bottom: 0;
    }
  }
  @media (min-width: ${Breakpoint.sm}) and (max-width: ${Breakpoint.md}) {
    padding: 0 ${asRem(15)};
  }
`;

export const ImageWidgetView = ({
  imageUrl,
  mobileImageUrl,
  tabletImageUrl,
  link,
  title,
  className,
}) => {
  const url = mobileImageUrl || tabletImageUrl || imageUrl;
  let mdUrl = null;
  let lgUrl = null;

  if (tabletImageUrl) {
    mdUrl = tabletImageUrl;
  }

  if (imageUrl && (imageUrl !== url)) {
    lgUrl = imageUrl;
  }

  return (
    <ImageViewWrapper className={className}>
      <Link href={link} prefetch={false}>
        <a>
          <picture>
            {mdUrl && (
              <source
                srcSet={fixMediaUrl(mdUrl)}
                media={`(min-width: ${Breakpoint.md})`}
              />
            )}
            {lgUrl && (
              <source
                srcSet={fixMediaUrl(lgUrl)}
                media={`(min-width: ${Breakpoint.lg})`}
              />
            )}
            <img src={fixMediaUrl(url)} alt={title} />
          </picture>
          {title && (
            <div>
              <TextMedium16>{title}</TextMedium16>
            </div>
          )}
        </a>
      </Link>
    </ImageViewWrapper>
  );
};

ImageWidgetView.propTypes = {
  imageUrl: PropTypes.string,
  mobileImageUrl: PropTypes.string,
  tabletImageUrl: PropTypes.string,
  link: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
};
