import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { Form, Formik } from 'formik';
import { PaymentMethodPickerView } from '@/roanuz/view/cart/payment/paymentMethods';
import { PaymentMethod, buildCreateOrderInput } from '@/roanuz/view/cart/payment/model';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';
import {
  SetPaymentMethodAndOrderMutation,
} from '@/store/cart/query';
import { afterOrderCreate, beforeOrderCreate, LocalCartStorage } from '@/roanuz/lib/cart';
import { Text16 } from '@/roanuz/typopgraphy';
import Config from '@/config';
import { PaymentMethodNetgiroController } from './netgiro';
import { PaymentMethodSiminnController } from './siminn';
import { PaymentMethodBorgunPaymentController } from './borgun';
import { PaymentMethodController } from './methodController';

const PaymentMethodPickerControllerWrapper = styled(FormWrapperStyle)`
`;

export const PaymentMethodPickerController = ({
  cart, onOrderStatus, extensionAttributes,
}) => {
  const paymentMethod = cart.paymentMethod || {};
  const [formInitVal] = useState({
    paymentMethod: paymentMethod.code || '',
  });
  const [loaderTillNextRoute, setLoaderTillNextRoute] = useState(false);

  const onCreateOrder = (data) => {
    if (!data.rzPlaceOrder) {
      LocalCartStorage.remove();
      console.log('Error Creating Order');
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
        completed: true,
      });
    }
  };

  const [
    createOrderMethod,
    { called: createOrderCalled, error: createOrderError, loading: createOrderLoading },
  ] = useMutation(SetPaymentMethodAndOrderMutation, {
    onCompleted: (data) => onCreateOrder(data),
  });

  useEffect(() => {
    if (onOrderStatus) {
      onOrderStatus({
        error: createOrderError,
        loading: createOrderLoading,
        completed: createOrderCalled && (!createOrderLoading) && (!createOrderError),
      });
    }
    setLoaderTillNextRoute(false);
  }, [createOrderError]);

  const onSubmit = (values) => {
    setLoaderTillNextRoute(true);
    console.log('Select Payment Method', values);
    beforeOrderCreate(cart, values, extensionAttributes);
    createOrderMethod({
      variables: { ...buildCreateOrderInput(cart, values, extensionAttributes) },
    });
  };

  const buildController = ((method, values) => {
    let key = '';
    let image = null;
    let methodConfig = PaymentMethod[method.code];
    if (!PaymentMethod[method.code]) {
      console.log('Unknown Payment Method', method);
      key = method.code;
      methodConfig = {};
    } else {
      key = PaymentMethod[method.code].uid;
      image = {
        alt: `Image of ${method.title}`,
        src: PaymentMethod[method.code].image,
      };
    }

    const params = {
      key,
      field: {
        type: 'radio',
        id: 'paymentMethod',
        name: '',
        value: method.code,
      },
      saving: createOrderLoading || loaderTillNextRoute,
      saveError: createOrderError,
      selected: method.code === values.paymentMethod,
      image,
      cart,
      method,
      onOrderStatus,
      extensionAttributes,
    };

    if (methodConfig.isNetgiro) {
      return (
        <PaymentMethodNetgiroController
          {...params}
        />
      );
    }

    if (methodConfig.isSiminn) {
      return (
        <PaymentMethodSiminnController
          {...params}
        />
      );
    }

    if (methodConfig.isBorgunPay) {
      return (
        <PaymentMethodBorgunPaymentController
          {...params}
        />
      );
    }

    if (methodConfig.isInvoice) {
      return (
        <PaymentMethodController
          {...params}
        >
          <div className="transfer-details">
            <Text16>
              Kennitala:&nbsp;
              <strong>{Config.MerchantIdNumber}</strong>
            </Text16>
            <Text16>
              Reikningsnúmer:&nbsp;
              <strong>{Config.MerchantAccountNumber}</strong>
            </Text16>
            <Text16>
              Ef þú hefur einhverjar spurningar sendu okkur tölvupóst á&nbsp;
              <a href={`mailto:${Config.EnquiryFormRecipientsEmail}`}>{Config.EnquiryFormRecipientsEmail}</a>
            </Text16>
          </div>
        </PaymentMethodController>
      );
    }

    if (!Object.keys(methodConfig).length) {
      return null;
    }

    return (
      <PaymentMethodController
        {...params}
      />
    );
  });

  return (
    <PaymentMethodPickerControllerWrapper>
      <Formik
        initialValues={formInitVal}
        onSubmit={onSubmit}
        validateOnMount
      >
        {({ values }) => (
          <Form>
            <PaymentMethodPickerView
              cart={cart}
              onOrderStatus={onOrderStatus}
              onSubmit={onSubmit}
            >
              {cart.availablePaymentMethods.map((method) => (
                <>
                  {buildController(method, values)}
                </>
              ))}
            </PaymentMethodPickerView>
          </Form>
        )}
      </Formik>

    </PaymentMethodPickerControllerWrapper>
  );
};

PaymentMethodPickerController.propTypes = {
  cart: PropTypes.object.isRequired,
  onOrderStatus: PropTypes.func,
  extensionAttributes: PropTypes.object,
};
