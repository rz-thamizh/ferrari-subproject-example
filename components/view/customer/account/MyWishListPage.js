import React from 'react';
import styled from 'styled-components';
import { StoreConfigConsumer } from '@/store/core/context';
import { MyWishlistController } from '@/roanuz/controller/customer/myWishlist';
import { MyAccountPageLayout } from '@/roanuz/layout/customer/myAccountPage';

const MyAccountPageWrapper = styled.div`
`;

const MyWishListPage = () => {
  return (
    <StoreConfigConsumer>
      {() => (
        <MyAccountPageWrapper>
          <MyAccountPageLayout
            pageTitle="Óskalistinn minn"
            title="Óskalistinn minn"
          >
            <MyWishlistController />
          </MyAccountPageLayout>
        </MyAccountPageWrapper>
      )}
    </StoreConfigConsumer>
  );
};

MyWishListPage.propTypes = {
};

export default MyWishListPage;
