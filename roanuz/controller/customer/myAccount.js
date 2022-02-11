import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MyAccountView } from '@/roanuz/view/customer/myAccount';
import { asRem, Breakpoint } from '@/roanuz/lib/css';

const MyAccountControllerWrapper = styled.div`
  width: 100%;
  padding: ${asRem(20)} 0;
  @media screen and (min-width: ${Breakpoint.sm}) {
    padding: ${asRem(20)} 0 0 ${asRem(20)};
  }
`;

export const MyAccountController = ({ pageTitle }) => {
  return (
    <MyAccountControllerWrapper>
      <MyAccountView pageTitle={pageTitle} />
    </MyAccountControllerWrapper>
  );
};

MyAccountController.propTypes = {
  pageTitle: PropTypes.string,
};
