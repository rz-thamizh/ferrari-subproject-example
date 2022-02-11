import React from 'react';
import styled from 'styled-components';
import { StoreConfigConsumer } from '@/store/core/context';
import { MyAddressController } from '@/roanuz/controller/customer/myAddress';
import { MyAccountPageLayout } from '@/roanuz/layout/customer/myAccountPage';

const MyAccountPageWrapper = styled.div`
`;

const MyAddressPage = () => {
  return (
    <StoreConfigConsumer>
      {() => (
        <MyAccountPageWrapper>
          <MyAccountPageLayout
            pageTitle="Heimilisföng"
            title="Heimilisföng"
          >
            <MyAddressController />
          </MyAccountPageLayout>
        </MyAccountPageWrapper>
      )}
    </StoreConfigConsumer>
  );
};

MyAddressPage.propTypes = {
};

export default MyAddressPage;
