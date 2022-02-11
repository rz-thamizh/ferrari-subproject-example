import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import {
  DisplayBold20,
} from '@/roanuz/typopgraphy';
import { ReactComponent as CloseIcon } from '@/roanuz/view/imgs/CloseIcon.svg';
import ClientOnlyPortal from '@/roanuz/view/clientOnlyPortal';
import { Button, ButtonList } from './button';

const DailogViewWrapper = styled.div`
  position:fixed;
  left: 0;
  top: 0;
  z-index: 999;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  transition: height 0.2s ease-in;

  >.dialog-bg {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: absolute;
    display: block;
    transition: all 0.4s ease-out;
  }

  >.dialog-container-wrapper {
    max-width: ${asRem(1440)};
    margin-left: auto;
    margin-right: auto;
    
    padding: ${asRem(20)};
    filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.25));

    flex-direction: column;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;

    ${(p) => p.containerWidth && css`
      @media screen and (min-width: ${Breakpoint.sm}) {
        width: ${p.containerWidth};
      }
    `}

    >.dialog-container {
      width: 100%;
      transition: all 0.5s ease-out;
      translate: 0 -100vh;
      opacity: 0;
      background: var(--color-text-rev);
      border-radius: ${asRem(6)};
      padding: ${asRem(15)};
      @media screen and (min-width: ${Breakpoint.sm}) {
        padding: ${asRem(20)};
      }

      display: flex;
      max-height: 100%;
      flex-direction: column;

      >.dialog-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: ${asRem(10)};

        h4 {
          padding-bottom: 0;
        }

        button {
          display: block;
          padding-right: 0;
        }

        .rz-svg-icon {
          color: var(--color-disabled);
          padding-right: 0;

          &:hover {
            color: var(--color-text);
          }
        }
      }

      >.dialog-action {
        border-top: 1px solid var(--color-disabled-3);
        padding-top: ${asRem(10)};
        margin-top: ${asRem(20)};
      }

      >.dialog-content {
        flex-grow: 2;
        overflow: auto;
        >section {
          padding-bottom: ${asRem(10)};
        }
      }
    }
  }


  ${(p) => p.show && css`
    >.dialog-bg {
      background-color: #33333345;
    }
    >.dialog-container-wrapper {
      >.dialog-container {
        opacity: 1;
        translate: 0 0;
      }
    }
  `}
`;

export const DailogView = ({
  show, children,
  titleText, titleSection, showClose,
  actionSection, confirmText,
  containerWidth,
  onConfirm, onClose,
}) => {
  const onViewClose = (event) => {
    if (onClose) {
      onClose(event);
    }
  };

  const onBgKeyPress = (event) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === 'Esc' || event.key === 'Escape') {
      onViewClose();
    }

    event.preventDefault();
  };

  // To wait for animation to finish while closing
  const [confirmedState, setConfirmedState] = useState(show);
  const [softState, setSoftState] = useState(show);
  const [timerId, setTimerId] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setSoftState(show);
    }, 10);
  }, [show]);

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
    }

    const newTimerId = setTimeout(() => {
      setConfirmedState(softState);
    }, 510);
    setTimerId(newTimerId);

  // Don't listen to timerId
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [softState]);

  if ((!confirmedState) && (!softState) && (!show)) {
    return null;
  }

  return (
    <ClientOnlyPortal>
      <DailogViewWrapper show={softState} containerWidth={containerWidth}>
        <div
          className="dialog-bg"
          onClick={onViewClose}
          onKeyDown={onBgKeyPress}
          role="presentation"
        />
        <div className="dialog-container-wrapper">
          <div className="dialog-container">
            <div className="dialog-title">
              {titleSection}
              {titleText && (
                <DisplayBold20>{titleText}</DisplayBold20>
              )}
              {showClose && onClose && (
                <Button
                  icon={<CloseIcon />}
                  noborder
                  onClick={onViewClose}
                  ariaLabel="Close Button"
                />
              )}
            </div>
            <div className="dialog-content">
              {children}
            </div>
            {(actionSection || confirmText) && (
              <div className="dialog-action">
                {actionSection}
                {confirmText && onConfirm && (
                  <ButtonList asList>
                    <Button
                      mode="primary"
                      onClick={onConfirm}
                      ariaLabel="Confirm"
                    >
                      {confirmText}
                    </Button>
                  </ButtonList>
                )}
              </div>
            )}
          </div>
        </div>
      </DailogViewWrapper>
    </ClientOnlyPortal>
  );
};

DailogView.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.element.isRequired,

  titleText: PropTypes.string,
  titleSection: PropTypes.element,
  showClose: PropTypes.bool,

  actionSection: PropTypes.element,
  confirmText: PropTypes.string,

  containerWidth: PropTypes.string,

  onConfirm: PropTypes.func,
  onClose: PropTypes.func,
};
