import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const BlueprintWrapper = styled.div`
  opacity: 0.85;
  background-color: ${(props) => props.color};
  height: ${(props) => props.height};
`;

export const Blueprint = ({
  name, color, height,
  children,
}) => {
  return (
    <BlueprintWrapper
      color={color || '#ee00fc'}
      height={height || '100%'}
    >
      {name}
      {children}
    </BlueprintWrapper>
  );
};

Blueprint.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  height: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
