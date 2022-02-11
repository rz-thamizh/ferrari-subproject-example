import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import {
  LayoutContainer,
} from '@/store/layout/layout';

import ContainerWidgets from '@/components/layout/ContainerWidgets';
import { StoreConfigConsumer, UserConsumer } from '@/store/core/context';
import { UrlResolverQuery } from '@/store/cms/query';
import CmsPage from '@/components/view/CmsPage';
import CategoryPage from '@/components/view/CategoryPage';
import ProductPage from '@/components/view/ProductPage';
import CheckoutPage from '@/components/view/CheckoutPage';
import CartPage from '@/components/view/CartPage';
import ContactUsPage from '@/components/view/ContactUsPage';
import BrandListPage from '@/components/view/BrandList';
import OnlineClubPage from '@/components/view/OnlineClubPage';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { NotFound } from '@/roanuz/page/404';

export const Page = ({ reqPath }) => {
  // console.log('RZ: Req Path', reqPath);
  const {
    loading: urlMetaLoading,
    error: urlMetaError,
    data: urlMetaData,
  } = useQuery(UrlResolverQuery, { variables: { url: reqPath } });

  if ((!urlMetaData) && urlMetaLoading) return (<PageLoadingView message="Hleð síðu" />);
  if ((!urlMetaData) && urlMetaError) return (<PageErrorView error={urlMetaError} />);
  if (!urlMetaData) return (<PageErrorView error={{ message: 'Meta Missing' }} />);
  // console.log('Resolved', urlMetaData);
  const urlMeta = urlMetaData.urlResolver || {};
  let pageType = urlMeta.type;

  if (!pageType) {
    if (reqPath.startsWith('/checkout')) {
      pageType = 'CHECKOUT';
    }
    if (reqPath.startsWith('/cart')) {
      pageType = 'CART';
    }
    if (reqPath.startsWith('/contact')) {
      pageType = 'CONTACT';
    }
    if (reqPath.startsWith('/netklubbur')) {
      pageType = 'ONLINE_CLUB';
    }
    if (reqPath.startsWith('/vorumerki')) {
      pageType = 'VORUMERKI';
    }
  }

  let pageView = null;
  switch (pageType) {
    case 'CMS_PAGE':
      pageView = (userContext, storeConfig, storeWidgets, defaultWidgets) => (
        <CmsPage
          urlMeta={urlMeta}
          userContext={userContext}
          defaultWidgets={defaultWidgets}
          widgets={storeWidgets}
          storeConfig={storeConfig}
        />
      );
      break;
    case 'CATEGORY':
      pageView = (userContext, storeConfig, storeWidgets, defaultWidgets) => {
        return (
          <CategoryPage
            urlMeta={urlMeta}
            userContext={userContext}
            defaultWidgets={defaultWidgets}
            widgets={storeWidgets}
            storeConfig={storeConfig}
          />
        );
      };
      break;
    case 'PRODUCT':
      pageView = (userContext, storeConfig, storeWidgets, defaultWidgets, attributeMeta) => {
        return (
          <ProductPage
            urlMeta={urlMeta}
            userContext={userContext}
            defaultWidgets={defaultWidgets}
            widgets={storeWidgets}
            storeConfig={storeConfig}
            attributeMeta={attributeMeta}
          />
        );
      };
      break;
    case 'CHECKOUT':
      pageView = (userContext, storeConfig, storeWidgets, defaultWidgets) => (
        <CheckoutPage
          urlMeta={urlMeta}
          userContext={userContext}
          defaultWidgets={defaultWidgets}
          widgets={storeWidgets}
          storeConfig={storeConfig}
        />
      );
      break;
    case 'CART':
      pageView = (userContext, storeConfig, storeWidgets, defaultWidgets) => (
        <CartPage
          urlMeta={urlMeta}
          userContext={userContext}
          defaultWidgets={defaultWidgets}
          widgets={storeWidgets}
          storeConfig={storeConfig}
        />
      );
      break;
    case 'CONTACT':
      pageView = (userContext, storeConfig, storeWidgets, defaultWidgets) => (
        <ContactUsPage
          urlMeta={urlMeta}
          userContext={userContext}
          defaultWidgets={defaultWidgets}
          widgets={storeWidgets}
          storeConfig={storeConfig}
        />
      );
      break;
    case 'ONLINE_CLUB':
      pageView = (userContext, storeConfig, storeWidgets, defaultWidgets) => (
        <OnlineClubPage
          urlMeta={urlMeta}
          userContext={userContext}
          defaultWidgets={defaultWidgets}
          widgets={storeWidgets}
          storeConfig={storeConfig}
        />
      );
      break;
    case 'VORUMERKI':
      pageView = (userContext, storeConfig, storeWidgets, defaultWidgets) => (
        <BrandListPage
          urlMeta={urlMeta}
          userContext={userContext}
          defaultWidgets={defaultWidgets}
          widgets={storeWidgets}
          storeConfig={storeConfig}
        />
      );
      break;
    default:
      pageView = null;
  }

  return (
    <UserConsumer>
      {(userContext) => (
        <StoreConfigConsumer>
          {({
            storeConfig,
            storeWidgets,
            defaultWidgets,
            attributeMeta,
          }) => (
            <div>
              <main>
                {pageView ? pageView(
                  userContext, storeConfig, storeWidgets,
                  defaultWidgets, attributeMeta,
                ) : (
                  <div>
                    <NotFound />
                  </div>
                )}
              </main>

              <footer>
                <ContainerWidgets
                  widgets={defaultWidgets}
                  container={LayoutContainer.FooterLinks}
                />
              </footer>
            </div>
          )}
        </StoreConfigConsumer>
      )}
    </UserConsumer>

  );
};

Page.propTypes = {
  reqPath: PropTypes.string.isRequired,
};

export default Page;
