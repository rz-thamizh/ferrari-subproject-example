import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

export const Row = styled('div').attrs({ className: 'rz-row' })`
  display: flex;

  ${(props) => props.spaceBetween && css`
    justify-content: space-between;
  `}

  ${(props) => props.alignCenter && css`
    align-items: center;
  `}
`;

Row.propTypes = {
  spaceBetween: PropTypes.bool,
};

export const Col = styled('div').attrs({ className: 'rz-col' })`
`;
