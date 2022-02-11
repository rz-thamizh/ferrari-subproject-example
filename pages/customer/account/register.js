import React from 'react';
import PropTypes from 'prop-types';
import { StoreConfigConsumer, UserConsumer } from '@/store/core/context';
import RegisterPageView from '@/components/view/customer/account/RegisterPage';
import {
  LayoutContainer,
} from '@/store/layout/layout';
import ContainerWidgets from '@/components/layout/ContainerWidgets';

export const RegisterPage = ({ widgets }) => (
  <UserConsumer>
    {(userContext) => (
      <StoreConfigConsumer>
        {({ storeConfig, storeWidgets }) => (
          <div>
            <main>
              <RegisterPageView
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

RegisterPage.propTypes = {
  widgets: PropTypes.object,
};

export async function getServerSideProps() {
  return { props: {} };
}

export default RegisterPage;
