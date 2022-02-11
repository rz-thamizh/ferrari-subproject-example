import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import Head from 'next/head';

import { StoreConfigConsumer, UserConsumer } from '@/store/core/context';
import { UrlResolverQuery } from '@/store/cms/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import CmsPage from '@/components/view/CmsPage';
import { BrandPageController } from '@/roanuz/controller/brand/page';
import { createBrandKey, useBrandList } from '@/roanuz/view/brand/model';
import { SEOHead } from '@/roanuz/document';
import Config from '@/config';
import {
  dependencyRegister,
  // eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/brand';

dependencyRegister();

export const BrandPage = ({
  brand, widgets, storeConfig, categoryTreeData,
}) => {
  const resolvedBrandName = createBrandKey(brand);
  const cmsPageUrl = Config.BrandCmsPagePattern.replace('$0', resolvedBrandName);

  const {
    loading: brandsLoading,
    error: brandsError,
    brands,
  } = useBrandList();

  const {
    loading: urlMetaLoading,
    error: urlMetaError,
    data: urlMetaData,
  } = useQuery(UrlResolverQuery, { variables: { url: cmsPageUrl } });

  if ((!urlMetaData) && urlMetaLoading) return (<PageLoadingView message="Hleð síðu" />);
  if ((!urlMetaData) && urlMetaError) return (<PageErrorView error={urlMetaError} />);

  if ((!brands) && brandsLoading) return (<PageLoadingView message="Hleð síðu" />);
  if ((!brands) && brandsError) return (<PageErrorView error={brandsError} />);

  const matched = brands.filter((x) => x.key === resolvedBrandName);
  if (!matched.length) {
    (<PageErrorView error={{ message: `Vörumerki ${brand} fannst ekki` }} />);
    return null;
  }

  const [brandMeta] = matched;

  // Use CMS page
  if (urlMetaData && urlMetaData.urlResolver) {
    return (
      <UserConsumer>
        {(userContext) => (
          <StoreConfigConsumer>
            {({
              storeWidgets,
              defaultWidgets,
            }) => (
              <CmsPage
                urlMeta={urlMetaData.urlResolver}
                userContext={userContext}
                defaultWidgets={defaultWidgets}
                widgets={storeWidgets}
                storeConfig={storeConfig}
                brandMeta={brandMeta}
              />
            )}
          </StoreConfigConsumer>
        )}
      </UserConsumer>
    );
  }

  const metaDesc = `Allar vörur frá ${brandMeta.name}`;
  return (
    <StoreConfigConsumer>
      {() => (
        <div>
          <SEOHead
            title={brandMeta.name}
            desc={metaDesc}
            keywords={brandMeta.name}
          />
          <Head>
            {brandMeta.imageUrl && (
              <meta
                property="og:image"
                content={brandMeta.imageUrl}
                key="og_image"
              />
            )}
          </Head>
          <div>
            <BrandPageController
              widgets={widgets}
              brandMeta={brandMeta}
              categoryTreeData={categoryTreeData}
            />
          </div>
        </div>
      )}
    </StoreConfigConsumer>
  );
};

BrandPage.propTypes = {
  brand: PropTypes.string.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object).isRequired,
  storeConfig: PropTypes.object.isRequired,
  categoryTreeData: PropTypes.object.isRequired,
};
