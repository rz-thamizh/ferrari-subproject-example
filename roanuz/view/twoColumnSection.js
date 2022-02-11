import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { TwoColumnSectionLayout } from '../layout/twoColumnSection';
import { ImageView } from './image';
import { Display50 } from '../typopgraphy';
import { Button } from './button';

const TwoColumnSectionViewWrapper = styled.div`
`;

export const TwoColumnSectionView = ({
  title,
  imageUrl,
  desc,
  linkText,
  link,
  padded,
}) => {
  return (
    <TwoColumnSectionViewWrapper>
      <TwoColumnSectionLayout
        image={imageUrl && (
          <ImageView src={imageUrl} useMediaUrl />
        )}
        title={title && (
          <Display50>{title}</Display50>
        )}
        desc={desc && (
          <p>{desc}</p>
        )}
        link={linkText && (
          <Link href={link} passHref>
            <Button
              as="a"
              alt={linkText}
              mode="primary"
              filled
              ariaLabel={linkText}
            >
              {linkText}
            </Button>
          </Link>
        )}
        padded={padded}
      />
    </TwoColumnSectionViewWrapper>
  );
};

TwoColumnSectionView.propTypes = {
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  desc: PropTypes.string,
  linkText: PropTypes.string,
  link: PropTypes.string,
  padded: PropTypes.bool,
};
