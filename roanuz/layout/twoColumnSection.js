import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { asRem, Breakpoint } from '../lib/css';

export const BaseTwoColumnSectionLayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${(p) => p.padded && css`
    margin-top: ${asRem(60)};
  `}

  >.column-1, >.column-2 {
    flex-grow: 1;
    flex-basis: 0;
  }

  >.column-1 {
    padding-top: ${asRem(20)};
    >.rz-image-view {
      width: 100%;
      img {
        width: 100%;
      }
    }
  }
  >.column-2 {
    margin: ${asRem(20)} ${asRem(40)};
    max-width: ${asRem(500)};
    .section-title, .section-desc, .section-link {
      margin-bottom: ${asRem(20)};
    }
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    flex-direction: row;
    >.column-2 {
      margin: ${asRem(20)} ${asRem(100)} ${asRem(20)} ${asRem(40)};
    }
  }
`;

export const TwoColumnSectionLayout = ({
  title,
  desc,
  image,
  link,
  padded,
}) => {
  return (
    <TwoColumnSectionLayoutWrapper padded={padded}>
      {image && (
        <div className="column-1">
          {image}
        </div>
      )}
      <div className="column-2">
        {title && (
          <div className="section-title">
            {title}
          </div>
        )}
        {desc && (
          <div className="section-desc">
            {desc}
          </div>
        )}
        {link && (
          <div className="section-link">
            {link}
          </div>
        )}
      </div>
    </TwoColumnSectionLayoutWrapper>
  );
};

TwoColumnSectionLayout.propTypes = {
  title: PropTypes.element,
  desc: PropTypes.element,
  image: PropTypes.element,
  link: PropTypes.element,
  padded: PropTypes.bool,
};

export const TwoColumnSectionLayoutWrapper = withDependencySupport(BaseTwoColumnSectionLayoutWrapper, 'TwoColumnSectionLayoutWrapper');
