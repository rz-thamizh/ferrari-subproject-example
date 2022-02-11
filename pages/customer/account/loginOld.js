import React from 'react';
import PropTypes from 'prop-types';
import { StoreConfigConsumer, UserConsumer } from '@/store/core/context';
import LoginPageView from '@/components/view/customer/account/LoginPage';
import {
  LayoutContainer,
} from '@/store/layout/layout';
import ContainerWidgets from '@/components/layout/ContainerWidgets';

export const LoginPage = ({ widgets }) => (
  <UserConsumer>
    {(userContext) => (
      <StoreConfigConsumer>
        {({ storeConfig, storeWidgets }) => (
          <div>
            <main>
              <LoginPageView
                urlMeta={{}}
                userContext={userContext}
                defaultWidgets={widgets}
                widgets={storeWidgets}
                storeConfig={storeConfig}
              />
            </main>
            <footer>
              <ContainerWidgets
                widgets={widgets}
                container={LayoutContainer.FooterLinks}
              />
            </footer>
          </div>
        )}
      </StoreConfigConsumer>
    )}
  </UserConsumer>
);

LoginPage.propTypes = {
  widgets: PropTypes.object,
};

export async function getServerSideProps() {
  return { props: {} };
}

export default LoginPage;
