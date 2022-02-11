import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Button } from '@/roanuz/view/button';
import { CircleIcon } from '@/roanuz/view/icon';
import { asRem } from '@/roanuz/lib/css';
import { ReactComponent as RightArrowIcon } from '@/roanuz/view/imgs/RightArrow.svg';

export const ArrowButtonView = ({
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      icon={<RightArrowIcon />}
      noborder
      ariaLabel="Right Arrow Button"
    />
  );
};

ArrowButtonView.propTypes = {
  onClick: PropTypes.func,
};

export const DotButton = styled(Button)`
  color: var(--color-grey);
  &:hover {
    color: var(--color-button);
  }

  .rz-svg-icon {
    padding-right: 0;
  }

  ${(props) => props.isActive && css`
    color: var(--color-button);
  `};
  width:  ${asRem(42)};
  height: ${asRem(42)};
  justify-content: center;
`;
export const DotButtonView = ({
  onClick,
  isActive,
}) => {
  return (
    <DotButton
      onClick={onClick}
      icon={<CircleIcon heightPx={8} />}
      noborder
      isActive={isActive}
    />
  );
};

DotButtonView.propTypes = {
  onClick: PropTypes.func,
  isActive: PropTypes.bool,
};
