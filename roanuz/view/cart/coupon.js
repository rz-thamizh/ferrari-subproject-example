import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import Validate from '@/roanuz/lib/validate';
import { asRem } from '@/roanuz/lib/css';
import { Formik, Form } from 'formik';
import {
  TextMedium16, LabelMedium12,
} from '@/roanuz/typopgraphy';
import { ApplyCouponToCartMutation, RemoveCouponToCartMutation } from '@/store/cart/query';
import ErrorView from '@/components/utils/ErrorView';
import LoadingView from '@/components/utils/LoadingView';
import { TickIcon } from '@/roanuz/view/icon';
import { FormItem } from '@/roanuz/view/input';
import { Button } from '../button';

const CouponViewWrapper = styled.div`
  .coupons-line {
    .coupons-line-item, .coupons-new-item {
      padding-top: ${asRem(14)};
    }
    .coupons-line-item {
      button {
        padding: 0;
        padding-left: ${asRem(10)};
        padding-right: ${asRem(15)};
      }
    }
    .rz-form-item {
      margin-right: 0;
    }

    .name-value-line {
      align-items: center;
      margin-bottom: ${asRem(8)};
      cursor: not-allowed;
      color: var(--color-disabled);
      background-color: var(--color-disabled-5);
      padding: ${asRem(14)} ${asRem(16)};
      border: ${asRem(1)} solid var(--color-disabled-3);
      border-radius: 0.25rem;
      button {
        padding-right: 0;
      }
    }

    .container {
      margin: 0;
      .text-center {
        transform: initial !important;
        color: var(--color-grey);
        font-size: ${asRem(14)};
      }
    }
    .debug-error-message {
      color: var(--color-error);
      font-size: ${asRem(14)};
    }
    .coupon-success {
      text-align: center;
      color: var(--color-active-2);
      font-size: ${asRem(14)};
      >span {
        margin-left: ${asRem(5)};
      }
    }
  }
`;

export const CouponView = ({
  cart,
}) => {
  const [formInitVal] = useState({ coupon: '' });
  const [showMessage, setShowMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState('');

  const [applyCoupon,
    {
      loading: couponLoading,
      error: couponError,
      data: couponData,
    }] = useMutation(ApplyCouponToCartMutation, {
    onCompleted: () => {
      setShowSuccessMessage('Afsláttarkóði virkjaður');
    },
  });

  const [removeCoupon,
    {
      loading: couponRemoveLoading,
      error: couponRemoveError,
      data: couponRemoveData,
    }] = useMutation(RemoveCouponToCartMutation, {
    onCompleted: () => {
      setShowMessage('Afsláttarkóði óvirkur');
    },
  });

  const onSubmit = (values) => {
    const variables = { cart_id: cart.id, coupon_code: values.coupon };
    applyCoupon({ variables });
  };

  const onRemove = () => {
    const variables = { cart_id: cart.id };
    removeCoupon({ variables });
  };

  useEffect(() => {
    setTimeout(() => {
      setShowSuccessMessage('');
      setShowMessage('');
    }, 2000);
  }, [showMessage]);

  return (
    <CouponViewWrapper>
      <div className="coupons-line">
        {cart.appliedCoupons && cart.appliedCoupons.length ? (
          <>
            {cart.appliedCoupons.map((code) => (
              <div className="coupons-line-item" key={code.uid}>
                <div className="name-value-line">
                  <TextMedium16 className="label">{code.code}</TextMedium16>
                  <div>
                    <Button mode="link" onClick={onRemove} ariaLabel="Remove">Fjarlægja</Button>
                  </div>
                </div>
                <div>
                  {couponRemoveLoading && <LoadingView message="Fjalægja afsláttarkóða" />}
                  {couponRemoveError && <ErrorView error={couponRemoveError} />}
                  {couponRemoveData && couponRemoveData.removeCouponFromCart && showMessage && (
                    <LabelMedium12 as="div" className="coupon-success">
                      <TickIcon heightPx={9} />
                      <span>{showMessage}</span>
                    </LabelMedium12>
                  )}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="coupons-new-item">
            <div>
              <Formik initialValues={formInitVal} onSubmit={onSubmit}>
                {({ values }) => (
                  <Form>
                    <FormItem
                      field={{
                        name: 'Sláðu inn afsláttarkóða',
                        id: 'coupon',
                        type: 'text',
                        validate: Validate.all([
                          Validate.required,
                        ], { message: 'Sláðu inn afsláttarkóða' }),
                        action: (
                          <Button mode="link" type="submit" disabled={!values.coupon} ariaLabel="Í lagi">Í lagi</Button>
                        ),
                      }}
                    />
                  </Form>
                )}
              </Formik>
              {couponLoading && <LoadingView message="Nota afsláttarkóða" />}
              {couponError && <ErrorView error={couponError} />}
            </div>
          </div>
        )}
        {couponData && couponData.applyCouponToCart
          && showSuccessMessage && !showMessage && !couponRemoveLoading && (
          <LabelMedium12 as="div" className="coupon-success">
            <TickIcon heightPx={9} />
            <span>{showSuccessMessage}</span>
          </LabelMedium12>
        )}
      </div>
    </CouponViewWrapper>
  );
};

CouponView.propTypes = {
  cart: PropTypes.object.isRequired,
};
