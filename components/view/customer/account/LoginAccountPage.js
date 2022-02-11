import React from 'react';
import PropTypes from 'prop-types';
import { SEOHead } from '@/roanuz/document';
import styled from 'styled-components';

import ContainerWidgets from '@/components/layout/ContainerWidgets';
import { LayoutContainer } from '@/store/layout/layout';
import { StoreConfigConsumer } from '@/store/core/context';
import { filterLoginWidgets } from '@/store/layout/widget';
import { LoginAccountController } from '@/roanuz/controller/customer/loginAccount';

const LoginAccountPageWrapper = styled.div`
`;

const LoginAccountPage = ({ widgets }) => {
  const pageWidgets = filterLoginWidgets({ widgets });

  return (
    <StoreConfigConsumer>
      {() => (
        <LoginAccountPageWrapper>
          <SEOHead
            title="Login"
          />
          <div>
            <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentTop} />
            <div>
              <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.Content} />
            </div>
            <LoginAccountController />
            <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentBottom} />
          </div>
        </LoginAccountPageWrapper>
      )}
    </StoreConfigConsumer>
  );
};

LoginAccountPage.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.object),
};

export default LoginAccountPage;
