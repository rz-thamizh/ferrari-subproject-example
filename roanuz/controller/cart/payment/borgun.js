import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useLazyQuery } from '@apollo/client';
import Config from '@/config';

import {
  SetPaymentMethodAndOrderMutation,
  BorgunPaymentTokenQuery,
} from '@/store/cart/query';
import styled from 'styled-components';
import { PaymentMethodItemView } from '@/roanuz/view/cart/payment/paymentMethodItem';
import { PaymentMethod, buildCreateOrderInput, buildSuccessUrl } from '@/roanuz/view/cart/payment/model';
import { beforeOrderCreate, afterOrderCreate } from '@/roanuz/lib/cart';
import { PaymentLoadingView } from '@/components/utils/PaymentLoadingView';
import { PaymentMethodController } from './methodController';

const PaymentMethodBorgunPaymentControllerWrapper = styled.div`
`;

export function processBorgunPay(response, orderId, baseUrl, cart) {
  const cartItemFields = {};
  cart.raw.items.forEach((item, index) => {
    cartItemFields[`itemdescription_${index}`] = item.product.name;
    cartItemFields[`itemcount_${index}`] = item.quantity;
    cartItemFields[`itemunitamount_${index}`] = item.prices.row_total_including_tax.value / item.quantity;
    cartItemFields[`itemamount_${index}`] = item.prices.row_total_including_tax.value;
  });
  const totalItems = cart.raw.items.length;
  cartItemFields[`itemdescription_${totalItems}`] = `Shipping: ${cart.shippingMethod.title}`;
  cartItemFields[`itemcount_${totalItems}`] = 1;
  cartItemFields[`itemunitamount_${totalItems}`] = cart.shippingCharge.value + cart.shipingMethodTaxCharge;
  cartItemFields[`itemamount_${totalItems}`] = cart.shippingCharge.value + cart.shipingMethodTaxCharge;
  // cartItemFields.amount = cart.prices.grand_total.value;

  // console.log('cartItemFields', cartItemFields);

  const { action } = response;
  const successUrl = buildSuccessUrl(baseUrl, PaymentMethod.borgun_gateway.uid);
  const postData = {
    ...cartItemFields,
    merchantid: response.fields.merchantId,
    paymentgatewayid: response.fields.paymentGatewayId,
    checkhash: response.fields.checkHash,
    orderid: orderId,
    currency: Config.Currency,
    language: 'IS',
    buyeremail: cart.email,
    returnurlsuccess: successUrl,
    returnurlsuccessserver: successUrl,
    returnurlcancel: successUrl,
    returnurlerror: successUrl,
    amount: `${cart.prices.grand_total.value}`,
    pagetype: '0',
    skipreceiptpage: '1',
    // buyername: '',
    // merchantemail: 'contact@roanuz.com',

    // orderid: orderId,
    // currency: Config.Currency,
    // language: getLocal(),
    // returnurlsuccess: successUrl,
    // returnurlsuccessserver: successUrl,
    // returnurlcancel: successUrl,
    // returnurlerror: successUrl,
    // buyeremail: cart.email,
    // ...response.fields,
    // ...cartItemFields,
  };

  // console.log('Borgun Post', action, postData);

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
  return (new Promise(() => {
    console.log('Waiting');
  }));
}

export const PaymentMethodBorgunPaymentController = ({
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
  const [orderId, setOrderId] = useState('');
  const [loaderTillNextRoute, setLoaderTillNextRoute] = useState(false);
  const [
    getHashKey,
    { loading: getHashKeyLoading, error: getHashKeyError, data: hashKeyData },
  ] = useLazyQuery(BorgunPaymentTokenQuery, { fetchPolicy: 'no-cache' });

  const onCreateOrder = (data) => {
    if (!data.rzPlaceOrder) {
      console.log('Error Creating Order', data);
      setLoaderTillNextRoute(false);
      return;
    }

    afterOrderCreate(data.rzPlaceOrder);
    const newOrderNumber = data.rzPlaceOrder.order.order_number;
    const newOrderId = data.rzPlaceOrder.order.order_id;
    setOrderId(newOrderId);
    if (onOrderStatus) {
      onOrderStatus({
        orderId: newOrderId,
        orderNumber: newOrderNumber,
      });
    }

    getHashKey({
      variables: {
        orderId: newOrderNumber,
        successUrl: buildSuccessUrl(
          Config.PublicURL || router.basePath, PaymentMethod.borgun_gateway.uid,
        ),
      },
    });
  };

  const [
    createOrderMethod,
    { error: createOrderError, loading: createOrderLoading },
  ] = useMutation(SetPaymentMethodAndOrderMutation, {
    onCompleted: (data) => onCreateOrder(data),
  });

  useEffect(() => {
    if (!createOrderError) return;
    setLoaderTillNextRoute(false);
  }, [createOrderError]);

  useEffect(() => {
    if (hashKeyData) {
      processBorgunPay(
        hashKeyData.rzBorgunToken,
        orderId,
        Config.PublicURL || router.basePath,
        cart,
      );
      return;
    }
    if (onOrderStatus) {
      onOrderStatus({
        error: getHashKeyError,
        loading: getHashKeyLoading,
        completed: hashKeyData !== undefined && hashKeyData !== null,
      });
    }
  }, [
    getHashKeyLoading,
    getHashKeyError,
    hashKeyData,
  ]);

  useEffect(() => {
    setLoaderTillNextRoute(false);
  }, [getHashKeyError]);

  const process = () => {
    setLoaderTillNextRoute(true);
    console.log('Creating Borgun Payment Order');
    beforeOrderCreate(cart, { paymentMethod: method.code }, extensionAttributes);
    createOrderMethod({
      variables: {
        ...buildCreateOrderInput(cart, { paymentMethod: method.code }, extensionAttributes),
      },
    });
  };

  return (
    <PaymentMethodBorgunPaymentControllerWrapper>
      {loaderTillNextRoute && (<PaymentLoadingView />)}
      <PaymentMethodItemView
        cart={cart}
        field={field}
        saving={saving || createOrderLoading || getHashKeyLoading || loaderTillNextRoute}
        method={method}
        image={image}
        selected={selected}
        buttonText={buttonText}
        buttonType={buttonType || 'button'}
        saveError={saveError || createOrderError || getHashKeyError}
        onClick={process}
        onOrderStatus={onOrderStatus}
      >
        {children}
      </PaymentMethodItemView>
    </PaymentMethodBorgunPaymentControllerWrapper>
  );
};

PaymentMethodBorgunPaymentController.propTypes = {
  ...PaymentMethodController.propTypes,
};
