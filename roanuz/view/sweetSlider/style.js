import styled, { css } from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseSweetSliderWrapper = styled.div`
--arrow-button-width: ${asRem(40)};

>.sweetslider-container {
  position: relative;

  >.arrow-item {
    background-color: #ffffff9c;
    border-radius: 50%;
    text-align: center;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 99;
    /* display: none; */
    min-width: var(--arrow-button-width);
    right: 0;
    left: auto;

    .rz-svg-icon {
      padding-right: 0;
    }

    &.arrow-left {
      right: auto;
      left: 0;
      svg {
        transform: rotate(-180deg);
      }
    }
    button {
      width: ${asRem(42)};
      height: ${asRem(42)};
      justify-content: center;
      @media screen and (min-width: ${Breakpoint.sm}) {
        width: initial;
        height: initial;
      }
    }
  } 
  >.sweetslider-container-items {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    overflow-x: auto;
    overflow-y: hidden;
  
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;
    ::-webkit-scrollbar { 
      display: none;  /* Safari and Chrome */
    }
  }
}

>.sweetslider-progress-bar {
  margin-top: ${asRem(30)};
  --padding: ${asRem(12)};
  --bar-height: ${asRem(2)};
  --hover-bar-height: ${asRem(4)};
  --current-bar-height: var(--bar-height);
  --hover-delta: calc((var(--hover-bar-height) - var(--bar-height)) / 2);

  /* padding: var(--padding) 0; */
  height: calc(var(--padding) + var(--hover-bar-height));
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease-out;
  position: relative;

  &:hover {
    --current-bar-height: var(--hover-bar-height);
  }

  >.full-bar {
    width: 100%;
    background: var(--color-grey);
    height: var(--current-bar-height);
    border-radius: var(--hover-bar-height);
    transform: translateX(0);

    >.active-bar {
      cursor: grabbing;
      position: absolute;
      /* top: 0;
      bottom: 0; */
      transform-origin: 0 0;
      background: var(--color-text);
      height: var(--current-bar-height);
      border-radius: var(--hover-bar-height);
    }
  }

  ${(props) => props.progressBarDragging && css`
    cursor: grabbing;

    >.full-bar {
      >.active-bar {
        cursor: grabbing;
        top: -50%;
        height: 200%;
      }
    }
  `}
}

.pager-dots-container {
  margin-top: ${asRem(10)};
  text-align: center;
}

@media screen and (min-width: ${Breakpoint.lg}) {
  ${(props) => props.showPageArrows && css`

    >.sweetslider-container{
      >.arrow-item {
        transform: translateY(-50%) translateX(75%);

        &.arrow-left {
          transform: translateY(-50%) translateX(-70%);
        }
      }
    }
  `}

  /* .sweetslider-container {
    >.arrow-item {
      display: block;
    }
  }

  .pager-dots-container {
    display: none;
  } */
}
`;

export const BaseSweetSliderWrapper2 = styled(BaseSweetSliderWrapper)`
  .sweetslider-container {
    >.arrow-item {
      background-color: transparent;

      button {
        color: var(--color-button);

        svg {
          height: ${asRem(38)};
        }
      }
    }
  }
`;

export const SweetSliderWrapper = withDependencySupport(BaseSweetSliderWrapper, 'SweetSliderWrapper');
