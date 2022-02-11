import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { asRem } from '../lib/css';

const SVGIconWrapper = styled.div`
  display: inline-block;

  svg {
    height: 100%;
    transition: all 0.5s ease-out;
  }

  ${(props) => props.heightPx && css`
    height: ${asRem(props.heightPx)};
  `}

  ${(props) => props.upsideDown && css`
    svg {
      transform: rotate(-180deg);
    }
  `}

  ${(props) => props.turnLeft && css`
    svg {
      transform: rotate(-90deg);
    }
  `}

  ${(p) => !p.useOriginal && css`
    path[fill], line[fill] {
      fill: currentColor;
    }

    [stroke] {
      stroke: currentColor;
    }  
  `}

  ${(props) => props.fillOnHover && css`
    &:hover {
      color: var(--color-button);
    }
  `}
`;

export const SVGIcon = ({
  children, fillOnHover, useOriginal, heightPx,
  upsideDown, turnLeft,
  style,
}) => {
  return (
    <SVGIconWrapper
      className="rz-svg-icon"
      fillOnHover={fillOnHover}
      useOriginal={useOriginal}
      heightPx={heightPx}
      upsideDown={upsideDown}
      turnLeft={turnLeft}
      style={style}
    >
      {children}
    </SVGIconWrapper>
  );
};

SVGIcon.propTypes = {
  children: PropTypes.element,
  fillOnHover: PropTypes.bool,
  useOriginal: PropTypes.bool,
  heightPx: PropTypes.number,
  upsideDown: PropTypes.bool,
  turnLeft: PropTypes.bool,
  style: PropTypes.object,
};

export const CircleSVG = () => {
  return (
    <svg viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
};

export const CircleIcon = ({ fillOnHover, heightPx }) => {
  return (
    <SVGIcon fillOnHover={fillOnHover} heightPx={heightPx}>
      <CircleSVG />
    </SVGIcon>
  );
};

CircleIcon.propTypes = {
  fillOnHover: PropTypes.bool,
  heightPx: PropTypes.number,
};

export const TickIcon = ({ fillOnHover, heightPx }) => {
  return (
    <SVGIcon fillOnHover={fillOnHover} heightPx={heightPx}>
      <svg viewBox="0 0 12 9" fill="none">
        <path
          d="M10.3347 1L3.91807 7.41667L1.0014 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </SVGIcon>
  );
};

TickIcon.propTypes = {
  fillOnHover: PropTypes.bool,
  heightPx: PropTypes.number,
};
