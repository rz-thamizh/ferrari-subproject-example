import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StepPaymentMethodViewWrapper = styled.div`
`;

export const StepPaymentMethodView = ({
  children,
}) => {
  return (
    <StepPaymentMethodViewWrapper>
      {children}
    </StepPaymentMethodViewWrapper>
  );
};

StepPaymentMethodView.propTypes = {
  children: PropTypes.element,
};
