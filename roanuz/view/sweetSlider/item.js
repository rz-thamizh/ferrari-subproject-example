import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Breakpoint } from '@/roanuz/lib/css';

const buildStyle = (config, isLastItem) => {
  let spaceBetween = config.columns > 1 ? config.space : '0px';
  if (config.columns > 1 && config.space !== '0px') {
    spaceBetween = `calc(${config.space} + (${config.space} / ${config.columns - 1}))`;
  }
  const marginRight = (isLastItem) ? 0 : spaceBetween;
  const flexBasis = (config.columns > 0) ? `calc((100% / ${config.columns}) - ${spaceBetween})` : null;
  const flexShrink = (config.columns > 0) ? 0 : null;
  return css`
    margin-right: ${marginRight};
    flex-basis: ${flexBasis};
    flex-shrink: ${flexShrink};
  `;
};

// This will create lots of classes. But if we this to style
// initial render may not be same final. So lots of classes is better
const SweetSliderItemViewWrapper = styled.div`
  ${(props) => buildStyle(props.config.default, props.isLastItem)}

  @media screen and (min-width: ${Breakpoint.xs}) {
    ${(props) => buildStyle(props.config.xs, props.isLastItem)}
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    ${(props) => buildStyle(props.config.sm, props.isLastItem)}
  }

  @media screen and (min-width: ${Breakpoint.md}) {
    ${(props) => buildStyle(props.config.md, props.isLastItem)}
  }

  @media screen and (min-width: ${Breakpoint.lg}) {
    ${(props) => buildStyle(props.config.lg, props.isLastItem)}
  }
`;

export const SweetSliderItemView = ({ children, config, isLastItem }) => {
  return (
    <SweetSliderItemViewWrapper
      config={config}
      isLastItem={isLastItem}
    >
      {children}
    </SweetSliderItemViewWrapper>
  );
};

SweetSliderItemView.propTypes = {
  children: PropTypes.element,
  config: PropTypes.object,
  isLastItem: PropTypes.bool,
};
