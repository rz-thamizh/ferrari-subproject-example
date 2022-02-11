import React from 'react';
import styled from 'styled-components';
import { BouncingBallKF } from '@/roanuz/view/statefulView';
import { CircleIcon } from '@/roanuz/view/icon';
import { asRem } from '@/roanuz/lib/css';

const PaymentLoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(51, 51, 51, 0.27);
  z-index: 1001;
  display: flex;
  justify-content: center;
  align-items: center;
  .bounce {
    margin: auto;

    .rz-svg-icon {
      height: ${asRem(20)};
      line-height: 0;
      padding: 0;
      animation: ${BouncingBallKF} 1s cubic-bezier(0.36, 0, 0.66, -0.56) infinite alternate;
      animation-delay: 350ms;
    }
  }
`;

export const PaymentLoadingView = () => (
  <PaymentLoadingWrapper>
    <div className="bounce">
      <CircleIcon />
    </div>
  </PaymentLoadingWrapper>
);
