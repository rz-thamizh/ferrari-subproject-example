import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/client';

import {
  SetPaymentMethodAndOrderMutation,
  NetgiroTokenQuery,
} from '@/store/cart/query';
import { beforeOrderCreate, afterOrderCreate } from '@/roanuz/lib/cart';
import { PaymentMethodItemView } from '@/roanuz/view/cart/payment/paymentMethodItem';
import { PaymentMethod, buildCreateOrderInput, buildSuccessUrl } from '@/roanuz/view/cart/payment/model';
import { PaymentLoadingView } from '@/components/utils/PaymentLoadingView';
import { PaymentMethodController } from './methodController';

export function processNetgiro(response, baseUrl) {
  const { action } = response;
  const successUrl = buildSuccessUrl(baseUrl, PaymentMethod.netgiro.uid);
  const cancellUrl = successUrl;
  const confirmUrl = successUrl;
  const postData = {
    Iframe: false,
    PaymentSuccessfulURL: successUrl,
    PaymentCancelledURL: cancellUrl,
    PaymentConfirmedURL: confirmUrl,
    ...response.fields,
  };

  const form = document.createElement('form');
  form.setAttribute('action', action);
  // form.setAttribute('target', '_blank');
  form.setAttribute('method', 'post');
  form.setAttribute('hidden', true);
  form.setAttribute('enctype', 'application/x-www-form-urlencoded');

  Object.keys(postData).forEach((key) => {
    const value = postData[key];
    const inputItem = document.createElement('input');
    inputItem.setAttribute('type', 'hidden');
    inputItem.setAttribute('name', key);
    inputItem.setAttribute('value', value);
    form.appendChild(inputItem);
  });
  document.getElementsByTagName('body')[0].appendChild(form);

  form.submit();
  console.log('Form', form);
  return (new Promise(() => {
    console.log('Waiting');
  }));
  // return axios.post(methodConfig.url, postData);
}

const PaymentMethodNetgiroControllerWrapper = styled.div`
`;

export const PaymentMethodNetgiroController = ({
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
  const router = useRouter();
  const [loaderTillNextRoute, setLoaderTillNextRoute] = useState(false);
  const [
    getToken,
    { loading: getTokenLoading, error: getTokenError, data: tokenData },
  ] = useLazyQuery(NetgiroTokenQuery, { fetchPolicy: 'no-cache' });

  const onCreateOrder = (data) => {
    if (!data.rzPlaceOrder) {
      console.log('Error Creating Order', data);
      setLoaderTillNextRoute(false);
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

    const total = Math.floor(cart.prices.grand_total.value);
    getToken({ variables: { orderNumber: newOrderNumber, totalAmount: total } });
  };

  const [
    createOrderMethod,
    { error: createOrderError, loading: createOrderLoading },
  ] = useMutation(SetPaymentMethodAndOrderMutation, {
    onCompleted: (data) => onCreateOrder(data),
  });

  useEffect(() => {
    if (!createOrderError) return;
    console.log('Create Netgiro Order Error', createOrderError);
    if (onOrderStatus) {
      onOrderStatus({ error: createOrderError });
    }
    setLoaderTillNextRoute(false);
  }, [createOrderError]);

  useEffect(() => {
    console.log('Create Order', getTokenLoading, getTokenError, tokenData);
    if (tokenData) {
      processNetgiro(tokenData.rzNetgiroToken, router.basePath);
      return;
    }
    if (onOrderStatus) {
      onOrderStatus({
        error: getTokenError,
        loading: getTokenLoading,
        completed: tokenData !== undefined && tokenData !== null,
      });
    }
  }, [
    getTokenLoading, getTokenError, tokenData,
  ]);

  useEffect(() => {
    setLoaderTillNextRoute(false);
  }, [getTokenError]);

  const process = () => {
    setLoaderTillNextRoute(true);
    console.log('Creating netgiro order');
    beforeOrderCreate(cart, { paymentMethod: method.code }, extensionAttributes);
    createOrderMethod({
      variables: {
        ...buildCreateOrderInput(
          cart, { paymentMethod: method.code }, extensionAttributes,
        ),
      },
    });
  };

  return (
    <PaymentMethodNetgiroControllerWrapper>
      {loaderTillNextRoute && (<PaymentLoadingView />)}
      <PaymentMethodItemView
        cart={cart}
        field={field}
        saving={saving || createOrderLoading || getTokenLoading || loaderTillNextRoute}
        method={method}
        image={image}
        selected={selected}
        buttonText={buttonText}
        buttonType={buttonType || 'button'}
        saveError={saveError || createOrderError || getTokenError}
        onClick={process}
        onOrderStatus={onOrderStatus}
      >
        {children}
      </PaymentMethodItemView>
    </PaymentMethodNetgiroControllerWrapper>
  );
};

PaymentMethodNetgiroController.propTypes = {
  ...PaymentMethodController.propTypes,
};
