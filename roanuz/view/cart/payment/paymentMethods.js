// TODO: this should be moved to controller
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import {
  DisplayMedium20,
} from '@/roanuz/typopgraphy';

const PaymentMethodPickerViewWrapper = styled.div`
  h4 {
    padding-bottom: ${asRem(18)};
  }

`;
export const PaymentMethodPickerView = ({
  // eslint-disable-next-line no-unused-vars
  cart,
  children,
}) => {
  return (
    <PaymentMethodPickerViewWrapper>
      <div className="title-bar">
        <DisplayMedium20>Móttakandi</DisplayMedium20>
      </div>
      <div className="items">
        {children}
      </div>
    </PaymentMethodPickerViewWrapper>
  );
};

PaymentMethodPickerView.propTypes = {
  cart: PropTypes.object.isRequired,
  children: PropTypes.arrayOf(PropTypes.element),
};
