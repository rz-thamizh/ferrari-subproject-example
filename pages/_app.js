/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import '@/roanuz/styles/main.scss';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import {
  UserProvider, StoreConfigConsumer,
} from '@/store/core/context';

import { WishListProvider } from '@/store/core/wishlistContext';

import { DefaultHead, AdditionalHead, SEOHead } from '@/roanuz/document';
import { AppStyle } from '@/roanuz/style';

import { PageLayout } from '@/roanuz/layout';
import {
  LayoutContainer,
} from '@/store/layout/layout';
import ContainerWidgets from '@/components/layout/ContainerWidgets';

import { BrandsBarView } from '@/roanuz/view/brandsBar';
import { TopContentView } from '@/roanuz/view/topContent';
import { StickyBarController } from '@/roanuz/controller/stickyBar';
import { ClientUserSession } from '@/roanuz/controller/customer/session';
import { LegalBarView } from '@/roanuz/view/legalBar';
import { BottomContentView } from '@/roanuz/view/bottomContent';
import { FooterView } from '@/roanuz/view/footer/footer';
import { withFullTree } from '@/roanuz/app';
import { CookieConsentController } from '@/roanuz/controller/cookieConsent';
import { AnalyticsController } from '@/roanuz/controller/analytics';
// import Config from '@/config';

import { AppData } from '../store/core/appData';

NProgress.configure({ showSpinner: true });

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

function RzApp({
  Component,
  pageProps,
  userContext,
}) {
  return (
    <div className="app-root">
      <DefaultHead />
      <UserProvider value={userContext || { }}>
        <AppData>
          <StoreConfigConsumer>
            {({ defaultWidgets, categoryTreeData }) => (
              <>
                <AdditionalHead />
                <SEOHead />
                <AppStyle />
                <ClientUserSession />
                <CookieConsentController />
                <AnalyticsController />
                <WishListProvider>
                  <PageLayout
                    topBrands={(
                      <div>
                        <BrandsBarView />
                      </div>
                    )}
                    topSticky={(
                      <div>
                        <StickyBarController categoryTreeData={categoryTreeData} />
                      </div>
                    )}
                    topContent={(
                      <div>
                        <TopContentView />
                      </div>
                    )}
                    content={(
                      <Component {...pageProps} />
                    )}
                    bottomContent={(
                      <div>
                        <BottomContentView />
                      </div>
                    )}
                    bottomLinks={(
                      <div>
                        <FooterView />
                      </div>
                    )}
                    bottomLegal={(
                      <div>
                        <LegalBarView />
                      </div>
                    )}
                    bottomSticky={(
                      <ContainerWidgets
                        className="default-style"
                        widgets={defaultWidgets}
                        container={LayoutContainer.FooterSticky}
                      />
                    )}
                  />
                </WishListProvider>
              </>
            )}
          </StoreConfigConsumer>
        </AppData>
      </UserProvider>
    </div>
  );
}

RzApp.propTypes = {
  userContext: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
  apolloState: PropTypes.object,
  Component: PropTypes.elementType.isRequired,
};

export default withFullTree(RzApp);
