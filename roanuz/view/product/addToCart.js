import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components';
import { ReactComponent as CartIcon } from '@/roanuz/view/imgs/CartIcon.svg';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { StatefulButton } from '../statefulView';
import { CircleSVG } from '../icon';

export const AddToCartViewWrapper = styled.div`

`;

export const BaseAddToCartView = ({
  loading, error, data,
  onClick, disabled,
  className, buttonText = 'Setja í körfu',
  ...buttonParams
}) => {
  return (
    <AddToCartViewWrapper className={`rz-button-wrapper ${className}`}>
      <StatefulButton
        state={{ loading, error, data }}
        buttonIcon={<CartIcon />}
        loadingIcon={<CircleSVG />}
        buttonText={disabled ? 'Uppselt' : buttonText}
        doneText="Added"
        hideDoneText
        errorText="Villa, vinsamlegast reynið aftur"
        onClick={onClick}
        disabled={disabled}
        {...buttonParams}
      />
    </AddToCartViewWrapper>
  );
};

BaseAddToCartView.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  data: PropTypes.object,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  buttonText: PropTypes.string,
};

export const AddToCartView = withDependencySupport(BaseAddToCartView, 'AddToCartView');
