import React from 'react';
import styled from 'styled-components';
import { StoreConfigConsumer } from '@/store/core/context';
import { MyOrdersController } from '@/roanuz/controller/customer/myOrders';
import { MyAccountPageLayout } from '@/roanuz/layout/customer/myAccountPage';

const MyAccountPageWrapper = styled.div`
`;

const MyAccountPage = () => {
  return (
    <StoreConfigConsumer>
      {() => (
        <MyAccountPageWrapper>
          <MyAccountPageLayout
            pageTitle="Mínar pantanir"
            title="Mínar pantanir"
          >
            <MyOrdersController />
          </MyAccountPageLayout>
        </MyAccountPageWrapper>
      )}
    </StoreConfigConsumer>
  );
};

MyAccountPage.propTypes = {
};

export default MyAccountPage;
