import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import ContainerWidgets from '@/components/layout/ContainerWidgets';
import MagentoHtml from '@/components/layout/MagentoHtml';
import { LayoutContainer } from '@/store/layout/layout';
import { StoreConfigConsumer, StoreConfigContext } from '@/store/core/context';
import { CmsPageQuery } from '@/store/cms/query';
import { filterPageWidgets } from '@/store/layout/widget';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { DisplayBold40 } from '@/roanuz/typopgraphy';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { SEOHead } from '@/roanuz/document';
import { BottomCategoriesController } from '@/roanuz/controller/bottomCategories';
import { HomePageBannerController } from '@/roanuz/controller/cms/homePageBanner';
import Config from '@/config';

const CmsPageWrapper = styled.div`
  h1 {
    padding-top: ${asRem(30)};
  }
`;

const CmsPage = ({
  urlMeta,
  widgets,
  // eslint-disable-next-line no-unused-vars
  brandMeta,
}) => {
  const pageId = urlMeta.relative_url;
  const {
    loading: pageLoading,
    error: pageError,
    data: pageaData,
  } = useQuery(CmsPageQuery, { variables: { identifier: pageId } });
  const storeConfigInstance = useContext(StoreConfigContext);

  if ((!pageaData) && pageLoading) return (<PageLoadingView message="Preparing CMS page" />);
  if ((!pageaData) && pageError) return (<PageErrorView error={pageError} />);
  const { cmsPage } = pageaData;
  const isHome = pageId === storeConfigInstance.storeConfig.cms_home_page;
  const pageWidgets = filterPageWidgets({ widgets, isHome });

  return (
    <StoreConfigConsumer>
      {({ categoryTreeData }) => (
        <CmsPageWrapper>
          <SEOHead
            title={cmsPage.meta_title || cmsPage.title}
            desc={cmsPage.meta_description}
            keywords={cmsPage.meta_keywords}
          />
          <div>
            {cmsPage.content_heading && (
              <DisplayBold40 as="h1">{cmsPage.content_heading}</DisplayBold40>
            )}
            <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentTop} />
            <div>
              <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.Content} />
            </div>
            {isHome && (
              <HomePageBannerController />
            )}
            <MagentoHtml html={cmsPage.content} />
            {isHome && Config.ShowCatgoriesListOnHome && (
              <BottomCategoriesController categoryTreeData={categoryTreeData} />
            )}
            <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentBottom} />
          </div>
        </CmsPageWrapper>
      )}
    </StoreConfigConsumer>
  );
};

CmsPage.propTypes = {
  urlMeta: PropTypes.object.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object).isRequired,
  brandMeta: PropTypes.object,
};

export default CmsPage;
