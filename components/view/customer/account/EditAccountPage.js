import React from 'react';
import styled from 'styled-components';
import { StoreConfigConsumer } from '@/store/core/context';
import { EditAccountController } from '@/roanuz/controller/customer/editAccount';
import { MyAccountPageLayout } from '@/roanuz/layout/customer/myAccountPage';

const EditAccountPageWrapper = styled.div`
`;

const EditAccountPage = () => {
  return (
    <StoreConfigConsumer>
      {() => (
        <EditAccountPageWrapper>
          <MyAccountPageLayout
            pageTitle="Aðgangsupplýsingar"
            title="Aðgangsupplýsingar"
          >
            <EditAccountController />
          </MyAccountPageLayout>
        </EditAccountPageWrapper>
      )}
    </StoreConfigConsumer>
  );
};

EditAccountPage.propTypes = {
};

export default EditAccountPage;
