import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { TextBold14 } from '@/roanuz/typopgraphy';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { SVGIcon } from './icon';

const ButtonWrapper = styled(TextBold14)`
  padding: ${asRem(10)} ${asRem(24)};
  border-radius: ${asRem(30)};
  text-align: center;
  border: ${asRem(1)} solid;
  transition: all 0.4s ease-out;
  cursor: pointer;
  background: inherit;
  display: inline-flex;
  align-items: center;

  >span {
    display: inline-block;
    transition: all 500ms ease-in;
  }
  .rz-svg-icon {
    padding-right: ${asRem(10)};
    transition: all 500ms ease-in;
  }

  &:hover {
    color: var(--color-text-rev);
    background-color: var(--color-button);
  }

  ${(props) => props.hideTextOnMobile && css`
    >span {
      display: none !important;
    }
  `}

  ${(props) => props.large && css`
    .rz-svg-icon {
      height: ${asRem(21)};
    }
  `};

  @media screen and (min-width: ${Breakpoint.sm}) {
    ${(props) => props.hideTextOnMobile && css`
      >span {
        display: inherit !important;
      }
    `};

    ${(props) => props.large && css`
      font-size: ${asRem(16)};
      line-height: ${asRem(22)};
      >span {
        margin-top: ${asRem(7)};
        margin-bottom: ${asRem(7)};
      }
      .rz-svg-icon {
        height: ${asRem(30)};
      }
    `}
  }


  ${(props) => props.filled && css`
    color: var(--color-text-rev);
    border-color: var(--color-text);
    background-color: var(--color-text);
    &:hover {
      color: var(--color-text);
      border-color: var(--color-text-rev);
      background-color: var(--color-text-rev);
    }    
  `}

  ${(props) => props.mode === 'link' && css`
    color: var(--color-button);
    padding: 0;
    font-size: ${asRem(16)};
    line-height: ${asRem(22)};
    font-weight: 500;
    &:hover {
      color: var(--color-text);
      text-decoration: underline;
    }    
  `}

  ${(props) => props.mode === 'primary' && css`
    color: var(--color-button);
    &:hover {
      border-color: var(--color-button);
    }    
  `}

  ${(props) => (props.filled && props.mode === 'primary') && css`
    color: var(--color-text-rev);
    border-color: var(--color-button);
    background-color: var(--color-button);
    &:hover, &:focus {
      color: var(--color-text-rev);
      border-color: var(--color-button-hover);
      background-color: var(--color-button-hover);
    }    
  `}

  ${(props) => props.mode === 'sale' && css`
    color: var(--color-text);
    border-color: var(--color-indicator);
    background-color: var(--color-indicator);

    &:hover {
      color: var(--color-text);
      border-color: var(--color-indicator-hover);
      background-color: var(--color-indicator-hover);
    }
  `}

  ${(props) => props.mode === 'special' && css`
    color: var(--color-text-rev);
    border-color: var(--color-refurbished);
    background-color: var(--color-refurbished);

    &:hover {
      color: var(--color-text-rev);
      border-color: var(--color-refurbished-hover);
      background-color: var(--color-refurbished-hover);
    }
  `}

  ${(props) => props.disabled && css`
    color: var(--color-disabled-2);
    cursor: not-allowed;
    &:hover {
      color: var(--color-disabled-2);
      background-color: inherit;
    }
  `}


  ${(props) => (props.filled && props.disabled) && css`
    background-color: var(--color-disabled-5);
    border-color: var(--color-disabled-5);
    transition: none;
    &:hover {
      background-color: var(--color-disabled-5);
      border-color: var(--color-disabled-5);
    }
    >span {
      transition: none;
    }
  `}



  ${(props) => props.noborder && css`
    border-width: 0;
    background-color: transparent;
    padding: ${asRem(10)};

    &:hover {
      color: var(--color-button);
      background-color: transparent;
    }

    ${(p) => p.mode === 'primary' && css`
      color: var(--color-button);   
    `}

    ${(p) => p.mode === 'sale' && css`
      color: var(--color-indicator);
    `}

    ${(p) => p.mode === 'special' && css`
      color: var(--color-refurbished);
    `}
  `}

  ${(props) => props.nomargin && css`
    padding: 0;
  `}


  /* ${(props) => props.disabled && css`
    &:hover {
      cursor: not-allowed;
    }
    opacity: 0.7;
    color: #fff;
  `} */

  ${(props) => props.filledIconRed && css`
    color: var(--color-button);
    svg {
      fill: var(--color-button);
    }
    &:hover {
      border-color: transparent;
      color: var(--color-button);
      svg {
        fill: var(--color-button);
      }
    }
  `}

  ${(props) => !props.allowHover && css`
    &:hover {
      background-color: inherit;
      color: inherit;
      border-color: inherit;
    }
  `}

`;

export const Button = ({
  as, alt, ariaLabel,
  children, mode, icon,
  iconHeightPx, noborder, disabled,
  type, large, filled,
  nomargin,
  onClick, className, filledIconRed,
  hideTextOnMobile,
  iconProps,
  state = {},
  loadingView, errorViewFn, doneView,
}) => {
  const infrNobrder = (noborder !== undefined) ? noborder : (mode === 'link');
  const showChildren = true;
  let softHide = false;
  let showLoading = false;
  let showDone = false;
  let showError = false;
  if (state.loading && loadingView) {
    softHide = true;
    showLoading = true;
  } else if (state.error && errorViewFn) {
    showError = true;
  } else if (state.data && doneView) {
    softHide = true;
    showDone = true;
  }

  return (
    <ButtonWrapper
      as={as || 'button'}
      alt={alt}
      mode={mode || 'normal'}
      disabled={disabled}
      noborder={infrNobrder}
      large={large}
      allowHover={!(showLoading || showDone)}
      filled={filled}
      nomargin={nomargin}
      onClick={onClick}
      type={type || 'button'}
      className={`rz-button ${className}`}
      filledIconRed={filledIconRed}
      hideTextOnMobile={hideTextOnMobile}
      aria-label={ariaLabel || 'button'}
    >
      {showLoading && loadingView}
      {showDone && doneView}
      {showError && errorViewFn(state.error)}
      {showChildren && icon && (
        <SVGIcon
          style={{ opacity: (softHide) ? 0 : 1 }}
          heightPx={iconHeightPx || 21}
          {...iconProps}
        >
          {icon}
        </SVGIcon>
      )}
      {showChildren && children && (
        <span
          style={{ opacity: (softHide) ? 0 : 1 }}
        >
          {children}
        </span>
      )}
    </ButtonWrapper>
  );
};

Button.propTypes = {
  onClick: PropTypes.func,
  as: PropTypes.string,
  alt: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  mode: PropTypes.oneOf([
    'normal',
    'primary',
    'sale',
    'special',
    'link',
  ]),
  icon: PropTypes.element,
  iconHeightPx: PropTypes.number,
  noborder: PropTypes.bool,
  large: PropTypes.bool,
  filled: PropTypes.bool,
  nomargin: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  className: PropTypes.string,
  filledIconRed: PropTypes.bool,
  hideTextOnMobile: PropTypes.bool,
  iconProps: PropTypes.shape({ ...SVGIcon.propTypes }),
  ariaLabel: PropTypes.string,

  state: PropTypes.shape({
    loading: PropTypes.bool,
    error: PropTypes.object,
    data: PropTypes.object,
  }),
  loadingView: PropTypes.element,
  errorViewFn: PropTypes.elementType,
  doneView: PropTypes.element,
};

export const ButtonListWrapper = styled.div`
  display: inline-flex;

  ${(props) => props.block && css`
    display: flex;
    >button, >a, >.rz-button-wrapper {
      display: flex;
      justify-content: center;
      >span {
        display: block;
      }
    }
    .rz-button-wrapper {
      display: block;
      width: 100%;
      button {
        width: 100%;
        display: flex;
        justify-content: center;
        >span {
          display: block;
        }
      }
    }
  `}

  ${(props) => props.reverse && css`
    flex-direction: row-reverse;
  `}

  ${(props) => props.asList && css`
    flex-direction: column;
    >button, >a, >.rz-button-wrapper {
      margin-bottom: ${asRem(10)};
    }
  `}

  ${(props) => (props.reverse && props.asList) && css`
    flex-direction: column-reverse;
  `}


  ${(props) => props.reverseOnMobile && css`
    flex-direction: row-reverse;
    .rz-button-wrapper {
      width: auto;
      margin-bottom: 0;
    }
    @media screen and (min-width: ${Breakpoint.sm}) {
      flex-direction: column;
    }
  `}
`;

export const ButtonList = ({
  block, reverse, asList, children,
  reverseOnMobile,
}) => {
  return (
    <ButtonListWrapper
      block={block}
      reverse={reverse}
      asList={asList}
      reverseOnMobile={reverseOnMobile}
    >
      {children}
    </ButtonListWrapper>
  );
};

ButtonList.propTypes = {
  block: PropTypes.bool,
  reverse: PropTypes.bool,
  asList: PropTypes.bool,
  reverseOnMobile: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};
