import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FormItem } from '@/roanuz/view/input';
import { ImageView } from '@/roanuz/view/image';
import { PaymentMethodItemView } from '@/roanuz/view/cart/payment/paymentMethodItem';
import { PaymentLoadingView } from '@/components/utils/PaymentLoadingView';

const PaymentMethodControllerWrapper = styled.div`
`;

export const PaymentMethodController = ({
  cart,
  field, saving,
  method,
  image,
  selected,
  children,
  buttonText,
  buttonType,
  saveError,
  onClick,
  onOrderStatus,
}) => {
  return (
    <PaymentMethodControllerWrapper>
      {saving && (<PaymentLoadingView />)}
      <PaymentMethodItemView
        cart={cart}
        field={field}
        saving={saving}
        method={method}
        image={image}
        selected={selected}
        buttonText={buttonText}
        buttonType={buttonType}
        saveError={saveError}
        onClick={onClick}
        onOrderStatus={onOrderStatus}
      >
        {children}
      </PaymentMethodItemView>
    </PaymentMethodControllerWrapper>
  );
};

PaymentMethodController.propTypes = {
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
