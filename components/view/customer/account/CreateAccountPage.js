import React from 'react';
import PropTypes from 'prop-types';
import { SEOHead } from '@/roanuz/document';
import styled from 'styled-components';

import ContainerWidgets from '@/components/layout/ContainerWidgets';
import { LayoutContainer } from '@/store/layout/layout';
import { StoreConfigConsumer } from '@/store/core/context';
import { filterRegisterWidgets } from '@/store/layout/widget';
import { CreateAccountController } from '@/roanuz/controller/customer/createAccount';

const CreateAccountPageWrapper = styled.div`
`;

const CreateAccountPage = ({ widgets }) => {
  const pageWidgets = filterRegisterWidgets({ widgets });

  return (
    <StoreConfigConsumer>
      {() => (
        <CreateAccountPageWrapper>
          <SEOHead
            title="Búa til aðgang"
          />
          <div>
            <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentTop} />
            <div>
              <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.Content} />
            </div>
            <CreateAccountController />
            <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentBottom} />
          </div>
        </CreateAccountPageWrapper>
      )}
    </StoreConfigConsumer>
  );
};

CreateAccountPage.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.object),
};

export default CreateAccountPage;
