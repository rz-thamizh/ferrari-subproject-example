import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Formik } from 'formik';
import CartData from '@/stories/sample-data/cart.json';
import { PaymentMethod } from '@/roanuz/view/cart/payment/model';
import { PaymentMethodPickerView } from './paymentMethods';
import { PaymentMethodItemView } from './paymentMethodItem';
import { parseCart } from '../model';

export default {
  title: 'View / Cart / Payment Method Picker',
  component: PaymentMethodPickerView,
};

const Template = ({ cart }) => {
  const paymentMethod = cart.paymentMethod || {};
  const [formInitVal] = useState({
    paymentMethod: paymentMethod.code || '',
  });

  const [saving, setSaving] = useState(false);
  const handleSave = (pm) => {
    setSaving(true);
    const method = PaymentMethod[pm];
    console.log('M', method, method.postOrderHandle);
    if (method.isNetgiro) {
      method.postOrderHandle(cart, 123434).then(() => {
        console.log('Netgiro Done');
      }).catch((error) => {
        console.error(error);
      });
    }
  };
  return (
    <div>
      <div>
        <Formik
          initialValues={formInitVal}
          onSubmit={handleSave}
          validateOnMount
        >
          {({ values }) => (
            <Form>
              <PaymentMethodPickerView
                onReqSave={handleSave}
                cart={cart}
                saving={saving}
              >
                {cart.availablePaymentMethods.map((method) => (
                  <>
                    <PaymentMethodItemView
                      key={PaymentMethod[method.code].uid}
                      field={{
                        type: 'radio',
                        id: 'paymentMethod',
                        name: '',
                        value: method.code,
                      }}
                      saving={saving}
                      image={{
                        alt: `Image of ${method.title}`,
                        src: PaymentMethod[method.code].image,
                      }}
                      selected={method.code === values.paymentMethod}
                      cart={cart}
                      method={method}
                    />
                  </>
                ))}
              </PaymentMethodPickerView>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

Template.propTypes = {
  cart: PropTypes.object.isRequired,
};

export const Normal = Template.bind({});
Normal.args = {
  cart: parseCart(CartData.data.cart),
};
