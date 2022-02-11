import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { FormItem } from '@/roanuz/view/input';
import { useRouter } from 'next/router';
import { TextMedium16 } from '@/roanuz/typopgraphy';
import Config from '@/config';
import { ImageView } from '../../image';
import { Button } from '../../button';

const PaymentMethodItemViewWrapper = styled.div`
  margin-bottom: ${asRem(20)};
  padding: ${asRem(12)} ${asRem(18)};
  border: ${asRem(1)} solid var(--color-disabled-3);
  border-radius: ${asRem(6)};

  &:first-child {
    margin-top: 0;
  }

  >.selection {
    display: flex;
    align-items: center;

    >div {
      margin-right: 0;
      @media screen and (min-width: ${Breakpoint.lg}) {
        margin-right: ${asRem(42)};
      }
    }

    .rz-image-view {
      margin-right: ${asRem(30)};
      img {
        max-width: 100%;
      }
      width: ${asRem(100)};
      @media screen and (min-width: ${Breakpoint.sm}) {
        margin-right: ${asRem(50)};
      }
      @media screen and (min-width: ${Breakpoint.lg}) {
        width: ${asRem(130)};
      }
    }

    >p {
      display: block;
      flex-grow: 1;
      font-weight: 500;
      line-height: ${asRem(20)};
      font-size: 14px;
      width: ${asRem(100)};
      @media screen and (min-width: ${Breakpoint.sm}) {
        font-size: 16px;
        width: initial;
      }
    }

    .rz-form-field {
      padding-left: 0;
    }

    .rz-form-field, .rz-form-item {
      margin-bottom: 0;
    }
    .type-radio label{
      justify-content: left;
      align-items: center;
      font-weight: bold;
    }
  }
  >.method-content {
    padding-top: ${asRem(20)};
    margin-top: ${asRem(10)};
    margin-bottom: 0;
    border-top: ${asRem(1)} solid var(--color-disabled-3);

    p {
      // font-size: ${asRem(14)};
      // line-height: ${asRem(20)};
      padding-top: ${asRem(6)};
      strong {
        font-weight: bold;
      }
    }

    .transfer-details {
      margin-bottom: ${asRem(20)};
      p {
        padding-top: 0;
        margin-bottom: ${asRem(8)};
      }
    }

    @media screen and (min-width: ${Breakpoint.sm}) {
      .action > button {
        min-width: ${asRem(100)};
        justify-content: center;

        span {
          margin: 0;
        }
      }
    }
  }

  .payment-error {
    color: var(--color-focus);
    padding: 0 0 ${asRem(10)};
  }
`;

export const PaymentMethodItemView = ({
  field, saving,
  method,
  image,
  selected,
  children,
  buttonText,
  buttonType,
  saveError,
  onClick,
  // eslint-disable-next-line no-unused-vars
  onOrderStatus,
}) => {
  const router = useRouter();
  const isRetryPayment = router.query && router.query.isRetry;
  const isMethodTriedEarlier = router.query && router.query.method;
  const config = Config.cart.paymentMethods[method.code] || {};
  const title = config.title || method.title;
  return (
    <PaymentMethodItemViewWrapper>
      <div className="selection">
        <FormItem
          field={field}
          disabled={saving}
        />
        {image && (<ImageView {...image} />)}
        <p>{title}</p>
      </div>
      {selected && (
        <div className="method-content">
          <div className="method-desc">
            {children}
          </div>
          {saveError && (
            <div>
              Villa:
              {saveError.message}
            </div>
          )}
          {isRetryPayment && (isMethodTriedEarlier === method.code) && (
            <TextMedium16 className="payment-error">
              Villa: Greiðslu er ólokið, vinsamlegast reynið aftur
            </TextMedium16>
          )}
          <div className="action">
            <Button
              disabled={saving}
              mode="primary"
              type={buttonType || 'submit'}
              large
              filled
              onClick={onClick}
              ariaLabel={buttonText || 'Borga'}
            >
              {buttonText || 'Borga'}
            </Button>
          </div>
        </div>
      )}
    </PaymentMethodItemViewWrapper>
  );
};

PaymentMethodItemView.propTypes = {
  cart: PropTypes.object.isRequired,
  field: PropTypes.shape(FormItem.propTypes.field),
  method: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  saving: PropTypes.bool,
  image: PropTypes.shape(ImageView.propTypes),
  children: PropTypes.element,
  buttonText: PropTypes.string,
  buttonType: PropTypes.string,
  saveError: PropTypes.object,
  onClick: PropTypes.func,
  onOrderStatus: PropTypes.func,
};
