import PropTypes from 'prop-types';
import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { LabelMedium12 } from '@/roanuz/typopgraphy';
import { asRem } from '@/roanuz/lib/css';
import { Button } from '@/roanuz/view/button';
import { TickIcon, SVGIcon } from '@/roanuz/view/icon';

const StatefulView = ({
  state,
  loading,
  error,
  done,
  children,
}) => {
  let stateView = null;
  let showChildren = true;
  if (state.loading && loading) {
    showChildren = true;
    stateView = loading(state);
  } else if (state.error && error) {
    stateView = error(state.error);
  } else if (state.data && done) {
    stateView = done(state.data);
  }
  return (
    <>
      {stateView && stateView}
      {showChildren && children && children}
    </>
  );
};

StatefulView.propTypes = {
  state: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    data: PropTypes.object,
  }),
  loading: PropTypes.elementType,
  error: PropTypes.elementType,
  done: PropTypes.elementType,
  children: PropTypes.element,
};

export const BouncingBallKF = keyframes`
  0% {
    transform: translateY(-80%);
    color: var(--color-button);
  }

  50% {
    color: var(--color-refurbished);
  }

  80% {
    /* color: var(--color-refurbished); */
  }

  100% {
    transform: translateY(160%) scaleY(80%);
    /* color: var(--color-refurbished); */
  }
`;

export const OpacityKF = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const SacleKF = keyframes`
  0% {
    transform: scale(0.1);
  }
  100% {
    transform: scale(1);
  }
`;

export const MoveUpKF = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30%);
    border-color: #fff;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    border-color: #000;
  }
`;

const StatefulButtonWrapper = styled.div`
  display: inline-block;
  text-align: center;
  position: relative;

  .msg {
    transition: all 0.5s ease-out;
    margin-bottom: ${asRem(5)};
    position: absolute;
    top: -${asRem(20)};
    left: 0;
    ${(p) => p.stickCloser && css`
      top: -${asRem(10)};
    `}
    width: 100%;

    &.loading, &.done {
      top: 0;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.loading {
      animation: ${SacleKF} 500ms ease-in-out;

      top: 0;
      display: flex;
      align-items: center;

      .rz-svg-icon {
        height: ${asRem(10)};
        line-height: 0;
        padding: 0;
        animation: ${BouncingBallKF} 1s cubic-bezier(0.36, 0, 0.66, -0.56) infinite alternate;
        animation-delay: 350ms;
      }
    }

    &.done {
      color: var(--color-active);
      animation: ${MoveUpKF} 500ms ease-in-out;
      .rz-svg-icon {
        height: ${asRem(12)};
        padding-right: ${asRem(5)};
      }
    }

    &.error {
      background: #fff;
      color: var(--color-error);
    }

  }
`;

export const StatefulButton = ({
  state, noborder,
  buttonIcon, doneText, errorText, loadingIcon,
  buttonText, loadingKeyFrame, disabled,
  onClick, className, filledIconRed, stickCloser,
  hideDoneText,
  ...buttonParams
}) => {
  return (
    <StatefulButtonWrapper
      stickCloser={stickCloser}
      className="rz-statefull-button rz-button-wrapper"
    >
      <Button
        icon={buttonIcon}
        onClick={onClick}
        noborder={noborder}
        disabled={disabled}
        className={className}
        filledIconRed={filledIconRed}
        state={state}
        loadingView={(
          <div className="msg loading">
            <SVGIcon>
              {loadingIcon}
            </SVGIcon>
          </div>
        )}
        errorViewFn={(err) => (
          <LabelMedium12 as="div" className="msg error">
            {errorText || err.message}
          </LabelMedium12>
        )}
        doneView={(
          <LabelMedium12 as="div" className="msg done">
            <TickIcon />
            {!hideDoneText && (
              <span>{doneText || 'Added'}</span>
            )}
          </LabelMedium12>
        )}
        {...buttonParams}
      >
        {buttonText}
      </Button>
    </StatefulButtonWrapper>
  );
};

StatefulButton.propTypes = {
  state: StatefulView.propTypes.state.isRequired,
  buttonIcon: PropTypes.element,
  loadingIcon: PropTypes.element,
  buttonText: PropTypes.string,
  doneText: PropTypes.string,
  errorText: PropTypes.string,
  noborder: PropTypes.bool,
  disabled: PropTypes.bool,
  loadingKeyFrame: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string,
  filledIconRed: PropTypes.bool,
  stickCloser: PropTypes.bool,
  hideDoneText: PropTypes.bool,
};

export default StatefulView;
