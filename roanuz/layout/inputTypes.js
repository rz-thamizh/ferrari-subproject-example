import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';

export const StyledRadio = styled('div').attrs({ className: 'rz-custom-radio' })`
  input[type="radio"] {
    margin-right: ${asRem(10)};
    width: ${asRem(18)};
    height: ${asRem(18)};
    border: 1px solid;
    border-radius: ${asRem(18)};
    margin-top: 0;
    position: relative;

    &::before {
      content: "";
      display: block;
      width: ${asRem(12)};
      height: ${asRem(12)};
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
    }

    &:checked {
      &::before {
        border-color: var(--color-button);
        background-color: var(--color-button);
      }
    }
  }
`;

export const StyledCheckbox = styled('div').attrs({ className: 'rz-custom-checkbox' })`
  input[type="checkbox"] {
    margin-right: ${asRem(10)};
    width: ${asRem(16)};
    height: ${asRem(16)};
    border: 1px solid;
    border-radius: ${asRem(2)};
    margin-top: 0;
    position: relative;

    &::before {
      content: "";
      display: block;
      width: ${asRem(5)};
      height: ${asRem(10)};
      position: absolute;
      top: ${asRem(1)};
      left: ${asRem(5)};
      border: solid white;
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }

    &:checked {
      background-color: var(--color-button);
      border-color: var(--color-button);
      &::before {
        border-color: #fff;
      }
    }
  }
`;
