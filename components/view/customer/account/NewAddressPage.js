import React from 'react';
import styled from 'styled-components';
import { NewAddressController } from '@/roanuz/controller/customer/newAddress';
import { MyAccountPageLayout } from '@/roanuz/layout/customer/myAccountPage';

const MyAccountPageWrapper = styled.div`
`;

const NewAddressPage = () => {
  return (
    <MyAccountPageWrapper>
      <MyAccountPageLayout
        pageTitle="Heimilisföng"
        title="Bæta við heimilisfangi"
      >
        <NewAddressController />
      </MyAccountPageLayout>
    </MyAccountPageWrapper>
  );
};

NewAddressPage.propTypes = {
};

export default NewAddressPage;
