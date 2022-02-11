import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { StepPaymentMethodView } from '@/roanuz/view/cart/stepPaymentMethod';
import { PaymentMethodPickerController } from './payment/picker';

const StepPaymentMethodControllerWrapper = styled.div`
`;

export const StepPaymentMethodController = ({
  cart,
  onOrderStatus,
  extensionAttributes,
}) => {
  return (
    <StepPaymentMethodControllerWrapper>
      <StepPaymentMethodView>
        <PaymentMethodPickerController
          cart={cart}
          onOrderStatus={onOrderStatus}
          extensionAttributes={extensionAttributes}
        />
      </StepPaymentMethodView>
    </StepPaymentMethodControllerWrapper>
  );
};

StepPaymentMethodController.propTypes = {
  cart: PropTypes.object.isRequired,
  onOrderStatus: PropTypes.func,
  extensionAttributes: PropTypes.object,
};
