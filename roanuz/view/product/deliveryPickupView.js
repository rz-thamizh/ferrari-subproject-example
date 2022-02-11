import React, { useContext } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import {
  Bold16,
  TextMedium14,
} from '@/roanuz/typopgraphy';
import { ReactComponent as AssembleIcon } from '@/roanuz/view/imgs/AssembleIcon.svg';
import { ReactComponent as DeliveryIcon } from '@/roanuz/view/imgs/DeliveryIcon.svg';
import { ReactComponent as PickupIcon } from '@/roanuz/view/imgs/PickupIcon.svg';
import { ReactComponent as InfoIcon } from '@/roanuz/view/imgs/InfoIcon.svg';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { UserContext } from '@/store/core/context';
import { SVGIcon } from '../icon';

export const BaseDeliveryPickupViewWrapper = styled.div`
  padding-bottom: ${asRem(12)};
  margin-bottom: ${asRem(25)};
  border-bottom: 1px solid var(--color-grey-2);

  strong {
    font-weight: 700;
  }
  p {
    margin-bottom: ${asRem(13)};
  }
  .rz-svg-icon {
    width: ${asRem(35)};
    margin-right: ${asRem(10)};
    vertical-align: middle;
    text-align: center;
  }

  >.option-title {
    display: block;
    strong {
      display: block;
    }
  }
  .sameday {
    color: var(--color-active);
    font-weight: 700;
  }

  >.delivery-line {
    margin-bottom: ${asRem(10)};
    display: flex;
    align-items: center;
    align-content: center;
    >span {
      display: block;
    }
    >.rz-svg-icon {
      width: ${asRem(26)};
    }
  }

  >.title-container {
    display: flex;
    align-items: center;
    padding-bottom: ${asRem(10)};
  }
`;
export const TooltipPopupWrapper = styled.span`
  position: relative;
  .rz-svg-icon {
    display: block;
    cursor: pointer;
    width: auto;
    .info-icon {
      margin-left: ${asRem(8)};
    }
  }
  >.rz-svg-icon {
    margin-right: 0 !important;
  }
  .view-container {
    visibility: hidden;
    bottom: ${asRem(24)};
    left: ${asRem(-83)};
    background: var(--color-text-rev);
    box-shadow: 0 ${asRem(2)} ${asRem(12)} rgba(0, 0, 0, 0.08);
    border-radius: ${asRem(5)};
    position: absolute;
    z-index: 1;
    padding: ${asRem(20)};
    min-width: ${asRem(192)};
    &:after {
      content: " ";
      position: absolute;
      top: 100%;
      left: 50%;
      margin-left: ${asRem(-5)};
      border-width: ${asRem(8)};
      border-style: solid;
      border-color: var(--color-text-rev) transparent
        transparent transparent;
    }
    a {
      color: var(--color-button);
    }
  }
  &:hover .view-container {
    visibility: visible;
  }
`;

export const daysContext = (min, max) => {
  const minV = parseInt(min, 10);
  const maxV = parseInt(max, 10);
  if ((Number.isNaN(minV) || Number.isNaN(maxV))) {
    return '-'; // This case won't come i guess.
  }
  return (
    <>
      {minV === 0 && maxV === 0 && (
        <span className="sameday">samdægurs</span>
      )}
      {((minV !== 0 || maxV !== 0) && (
        <span>
          <strong>
            {minV}

            {minV !== maxV
              && (
              <span>
                -
                {maxV}
              </span>
              )}
            {(minV > 1 || maxV > 1) ? ' virkir dagar' : ' virkur dagur'}
          </strong>
        </span>
      ))}
    </>
  );
};

export const DeliveryPickupView = ({
  deliveryPickupTimes,
  loading,
}) => {
  const userContext = useContext(UserContext);
  if (loading) {
    return <TextMedium14>Hleður ...</TextMedium14>;
  }
  return (
    <DeliveryPickupViewWrapper className="rz-delivery-pickup-view">
      <div className="title-container">
        <Bold16 className="option-title">
          Afhending
        </Bold16>
        {!userContext.token && (
          <TooltipPopupWrapper>
            <SVGIcon
              heightPx={16}
            >
              <InfoIcon className="info-icon" />
            </SVGIcon>
            <TextMedium14 as="div" className="view-container">
              <Link href="/customer/account/login/" prefetch={false}>
                <a alt="Login" className="plain">
                  <strong>skráðu þig inn </strong>
                </a>
              </Link>
              til að fá nánari tímasetningu
            </TextMedium14>
          </TooltipPopupWrapper>
        )}
      </div>
      {deliveryPickupTimes && deliveryPickupTimes.assembly_time > 0 && (
      <TextMedium14 as="div" className="delivery-line">
        <SVGIcon heightPx={26}>
          <AssembleIcon />
        </SVGIcon>
        <span>Samsetningartími&nbsp;</span>
        <strong>
          {deliveryPickupTimes.assembly_time}
          {deliveryPickupTimes.assembly_time > 1 ? ' virkir dagar' : ' virkur dagur'}
        </strong>
      </TextMedium14>
      )}
      {deliveryPickupTimes && deliveryPickupTimes.delivery_time && (
      <TextMedium14 as="div" className="delivery-line">
        <SVGIcon heightPx={26}>
          <DeliveryIcon />
        </SVGIcon>
        <span>Heimsending&nbsp;</span>
        {
          daysContext(
            deliveryPickupTimes.delivery_time.min,
            deliveryPickupTimes.delivery_time.max,
          )
        }
      </TextMedium14>
      )}
      {deliveryPickupTimes && deliveryPickupTimes.pickup_time && (
      <TextMedium14 as="div" className="delivery-line">
        <SVGIcon heightPx={26}>
          <PickupIcon />
        </SVGIcon>
        <span>Sækja&nbsp;</span>
        {
          daysContext(
            deliveryPickupTimes.pickup_time.min,
            deliveryPickupTimes.pickup_time.max,
          )
        }
      </TextMedium14>
      )}
    </DeliveryPickupViewWrapper>
  );
};

DeliveryPickupView.propTypes = {
  deliveryPickupTimes: PropTypes.object,
  loading: PropTypes.bool,
};

export const DeliveryPickupViewWrapper = withDependencySupport(BaseDeliveryPickupViewWrapper, 'DeliveryPickupViewWrapper');
