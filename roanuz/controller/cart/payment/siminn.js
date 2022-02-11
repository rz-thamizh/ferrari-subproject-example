import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  SetPaymentMethodAndOrderMutation,
  PaymentSiminnOrderCreate,
  PaymentSiminnOrderStatus,
} from '@/store/cart/query';
import { TextMedium16 } from '@/roanuz/typopgraphy';
import { beforeOrderCreate, afterOrderCreate } from '@/roanuz/lib/cart';
import { PaymentMethodItemView } from '@/roanuz/view/cart/payment/paymentMethodItem';
import { buildCreateOrderInput } from '@/roanuz/view/cart/payment/model';
import { SiminnStatusView } from '@/roanuz/view/cart/payment/siminnStatus';
import { DailogView } from '@/roanuz/view/dialog';
import { PaymentMethodController } from './methodController';

const StatusCheckInterval = 3000;

const PaymentMethodSiminnControllerWrapper = styled.div`
`;

export const PaymentMethodSiminnController = ({
  cart,
  field, saving,
  method,
  image,
  selected,
  children,
  buttonText,
  buttonType,
  saveError,
  // eslint-disable-next-line no-unused-vars
  onClick,
  onOrderStatus,
  extensionAttributes,
}) => {
  const [siminnStatusLoading, setSiminnStatusLoading] = useState(false);
  const [siminnStatusError, setSiminnStatusError] = useState(false);
  const [siminnStatusMessage, setSiminnStatusMessage] = useState(false);

  const errorMessage = 'Failed. Try again!';
  const [isRetryPayment, setIsRetryPayement] = useState(false);
  const onOrderComplete = () => {
    if (onOrderStatus) {
      onOrderStatus({
        error: false,
        loading: false,
        completed: true,
      });
    }
  };

  const onOrderCancel = () => {
    setIsRetryPayement(true);
    if (onOrderStatus) {
      onOrderStatus({
        error: true,
        loading: false,
        completed: false,
      });
    }
  };

  const onOrderError = (error) => {
    setIsRetryPayement(true);
    if (onOrderStatus) {
      onOrderStatus({
        error: error || true,
        loading: false,
        completed: false,
      });
    }
  };

  // Status Polling
  const [
    checkOrderStatus,
    { error: orderStatusError, data: orderStatus, stopPolling },
  ] = useLazyQuery(PaymentSiminnOrderStatus, { fetchPolicy: 'no-cache', pollInterval: StatusCheckInterval });

  useEffect(() => {
    if (!orderStatusError) return;
    setSiminnStatusLoading(false);
    setSiminnStatusError(true);
    setSiminnStatusMessage(errorMessage);
    console.log('Error Siminn Status', orderStatusError);
  }, [orderStatusError]);

  useEffect(() => {
    if (!orderStatus) {
      return;
    }

    const status = orderStatus.rzSiminnOrderStatus;
    setSiminnStatusMessage(status.userMessage);
    if (status.error) {
      setSiminnStatusError(true);
      setSiminnStatusMessage(status.userMessage || errorMessage);
    } else if (status.statusAuthorized) {
      setSiminnStatusLoading(false);
      stopPolling();
      onOrderComplete();
    } else if (status.statusCanceled) {
      setSiminnStatusLoading(false);
      setSiminnStatusMessage(status.userMessage || errorMessage);
      stopPolling();
      onOrderCancel();
    }
  }, [orderStatus]);

  // Simin Order Create
  const onSiminnOrderCreate = (data) => {
    if (!data) return;

    if (!data.rzPaymentSiminnCreateOrder) {
      setSiminnStatusLoading(false);
      setSiminnStatusError(true);
      setSiminnStatusMessage(errorMessage);

      console.log('Error Creating Siminn Order', data);
      // onOrderError(errorMessage);
      return;
    }

    const status = data.rzPaymentSiminnCreateOrder;
    if (status.error) {
      console.log('Error Creating Siminn Order', data);
      setSiminnStatusLoading(false);
      setSiminnStatusError(true);
      setSiminnStatusMessage(status.userMessage || errorMessage);
      return;
    }
    checkOrderStatus({ variables: { orderKey: status.orderKey } });
  };

  const [
    createSiminnOrder,
    { error: createSiminnOrderError },
  ] = useMutation(PaymentSiminnOrderCreate, {
    onCompleted: (data) => onSiminnOrderCreate(data),
  });

  useEffect(() => {
    if (!createSiminnOrderError) return;
    setSiminnStatusLoading(false);
    setSiminnStatusError(true);
    setSiminnStatusMessage(errorMessage);
    console.log('Error Creating Siminn Order', createSiminnOrderError);
    onOrderError(createSiminnOrderError);
  }, [createSiminnOrderError]);

  // Place Order
  const onCreateOrder = (data) => {
    if (!data.rzPlaceOrder) {
      setSiminnStatusLoading(false);
      setSiminnStatusError(true);
      setSiminnStatusMessage(errorMessage);
      onOrderError(errorMessage);
      console.log('Error Creating Order', data);
      return;
    }

    afterOrderCreate(data.rzPlaceOrder);
    const newOrderNumber = data.rzPlaceOrder.order.order_number;
    const newOrderId = data.rzPlaceOrder.order.order_id;
    if (onOrderStatus) {
      onOrderStatus({
        orderId: newOrderId,
        orderNumber: newOrderNumber,
      });
    }

    createSiminnOrder({ variables: { orderNumber: newOrderNumber } });
  };

  const [
    createOrderMethod,
    { error: createOrderError, loading: createOrderLoading },
  ] = useMutation(SetPaymentMethodAndOrderMutation, {
    onCompleted: (data) => onCreateOrder(data),
  });

  useEffect(() => {
    if (!createOrderError) return;
    setSiminnStatusLoading(false);
    setSiminnStatusError(true);
    setSiminnStatusMessage(errorMessage);
    onOrderError(createOrderError);
  }, [createOrderError]);

  const process = () => {
    console.log('Creating siminn order');
    beforeOrderCreate(cart, { paymentMethod: method.code }, extensionAttributes);
    setSiminnStatusMessage(false);
    setSiminnStatusLoading(true);
    createOrderMethod({
      variables: {
        ...buildCreateOrderInput(cart, { paymentMethod: method.code }, extensionAttributes),
      },
    });
  };

  const closeAndCancel = () => {
    onOrderCancel();
    setSiminnStatusError(false);// To decide! we allow to close on loading also? if so reset loading
  };

  return (
    <PaymentMethodSiminnControllerWrapper>
      <DailogView
        titleText="Siminn Pay"
        showClose={siminnStatusError}
        onClose={() => closeAndCancel()}
        show={siminnStatusLoading || siminnStatusError}
        containerWidth="440px"
      >
        <SiminnStatusView
          loading={siminnStatusLoading}
          error={siminnStatusError}
          message={siminnStatusMessage}
        />
      </DailogView>
      <PaymentMethodItemView
        cart={cart}
        field={field}
        saving={saving || createOrderLoading || siminnStatusLoading}
        method={method}
        image={image}
        selected={selected}
        buttonText={buttonText}
        buttonType={buttonType || 'button'}
        saveError={saveError || createOrderError || siminnStatusError}
        onClick={process}
        onOrderStatus={onOrderStatus}
      >
        {isRetryPayment && (
          <TextMedium16 className="payment-error">
            Villa: Greiðslu er ólokið, vinsamlegast reynið aftur.
          </TextMedium16>
        )}
        {children}
      </PaymentMethodItemView>
    </PaymentMethodSiminnControllerWrapper>
  );
};

PaymentMethodSiminnController.propTypes = {
  ...PaymentMethodController.propTypes,
};
