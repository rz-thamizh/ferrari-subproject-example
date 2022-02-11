import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, asEm, Breakpoint } from '@/roanuz/lib/css';
import { ReactComponent as HeartIcon } from '@/roanuz/view/imgs/HeartIcon.svg';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { StatefulButton } from '../statefulView';
import { CircleSVG } from '../icon';

export const AddToWishListViewWrapper = styled.div`
  .rz-btn-atw {
    font-size: ${asRem(12)};
    line-height: ${asRem(16)};
    font-weight: 500;
    @media screen and (max-width: ${asEm(767)}) {
      padding-left: ${asRem(30)};
      .rz-svg-icon {
        height: ${asRem(16)};
      }
    }
    @media screen and (min-width: ${Breakpoint.sm}) {
      span {
        display: none;
      }
    }
  }
`;

export const BaseAddToWishListView = ({
  loading, error, data,
  onClick, disabled, inWishList, buttonText,
  ...buttonParams
}) => {
  return (
    <AddToWishListViewWrapper className="rz-button-atw rz-button-wrapper">
      <StatefulButton
        className="rz-btn-atw"
        state={{ loading, error, data }}
        buttonIcon={<HeartIcon />}
        loadingIcon={<CircleSVG />}
        buttonText={buttonText}
        hideDoneText
        errorText="Villa, vinsamlegast reynið aftur"
        onClick={onClick}
        disabled={disabled}
        noborder
        filledIconRed={inWishList}
        stickCloser
        {...buttonParams}
      />
    </AddToWishListViewWrapper>
  );
};

BaseAddToWishListView.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  data: PropTypes.object,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  inWishList: PropTypes.bool,
  buttonText: PropTypes.string,
};

export const AddToWishListView = withDependencySupport(BaseAddToWishListView, 'AddToWishListView');
