import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { StoreConfigQuery, WebsiteQuery, WebsiteStoresQuery } from '@/store/core/query';
import { useStoreWidgets, filterPageWidgets } from '@/store/layout/widget';
import { CategoryNavQuery } from '@/store/category/query';
import { useQuery } from '@apollo/client';
import {
  StoreConfigProvider,
} from '@/store/core/context';
import { CustomAttributeMetaData } from '@/store/brand/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import Config from '@/config';

const WebsiteConfigDefault = {
  websiteId: null,
  stores: [],
};

export const useWebsiteConfig = () => {
  const {
    loading: websiteLoading,
    data: websiteData,
    error: websiteError,
  } = useQuery(WebsiteQuery, {
    skip: !Config.Features.EnableDatoCMS,
    variables: { storeCode: Config.StoreViewCode },
  });

  const websiteId = websiteData?.rzdWebsite?.id;

  const {
    loading: storeLoading,
    data: storeData,
    error: storeError,
  } = useQuery(WebsiteStoresQuery, {
    skip: !websiteId,
    variables: {
      websiteId,
    },
  });

  if (storeError) {
    console.error(storeError);
    console.log(storeError.graphQLErrors);
  }

  return {
    loading: websiteLoading || storeLoading,
    data: {
      ...WebsiteConfigDefault,
      websiteId,
      stores: storeData?.allRzdStores,
    },
    error: websiteError || storeError,
  };
};

export const AppData = ({ children }) => {
  const { loading, error, data: storeConfigData } = useQuery(StoreConfigQuery);

  const {
    loading: websiteConfigLoading,
    error: websiteConfigError,
    data: websiteConfig,
  } = useWebsiteConfig();

  const {
    loading: widgetsLoading,
    error: widgetsError,
    data: storeWidgets,
  } = useStoreWidgets();

  const {
    loading: attributeMetaLoading,
    data: attributeMetaData,
  } = useQuery(CustomAttributeMetaData, {
    variables: { attributeCode: 'rz_show_piece_stores' },
  });

  const {
    loading: rzVisibleAttributeLoading,
    data: rzVisibleWebsitesData,
  } = useQuery(CustomAttributeMetaData, {
    variables: { attributeCode: 'rz_visible_websites' },
  });

  const {
    loading: categoryTreeLoading,
    data: categoryTree,
    error: categoryTreeError,
  } = useQuery(CategoryNavQuery,
    {
      skip: (!storeConfigData || (storeConfigData && !storeConfigData.storeConfig)),
      variables:
        { parentCategory: storeConfigData ? storeConfigData.storeConfig.root_category_uid : null },
    });

  const isLoading = loading || widgetsLoading || attributeMetaLoading
    || categoryTreeLoading || rzVisibleAttributeLoading || websiteConfigLoading;
  const isError = error || widgetsError || categoryTreeError || websiteConfigError;
  const hasData = storeConfigData && storeWidgets && attributeMetaData
    && categoryTree && rzVisibleWebsitesData;
  if ((!hasData) && isLoading) return (<PageLoadingView message="Preparing Storeconfig" />);
  if ((!hasData) && isError) return (<PageErrorView error={error || widgetsError} />);

  const { storeConfig } = storeConfigData;
  const defaultWidgets = filterPageWidgets({ widgets: storeWidgets });

  const rzVisibleWebsitesList = {};
  let rzVisibleProdcutOnWebsite = null;
  if (rzVisibleWebsitesData
      && rzVisibleWebsitesData.customAttributeMetadata
      && rzVisibleWebsitesData.customAttributeMetadata.items.length) {
    const visibleWebsites = rzVisibleWebsitesData
      .customAttributeMetadata.items[0].attribute_options;
    if (visibleWebsites && visibleWebsites.length) {
      visibleWebsites.forEach((website) => {
        rzVisibleWebsitesList[website.label] = website.value;
      });

      rzVisibleProdcutOnWebsite = rzVisibleWebsitesList[Config.WebsiteKey.toUpperCase()];
    }
  }

  const attributeMeta = {
    rzShowPieceStores: attributeMetaData,
    rzVisibleWebsites: rzVisibleWebsitesList,
    rzVisibleProdcutOnWebsiteCode: rzVisibleProdcutOnWebsite,
  };
  const listOfAllChildCategories = [];
  const fetchAllNestedChildren = (obj) => {
    listOfAllChildCategories.push(obj.id);
    if (!obj.children) {
      return;
    }
    if (obj.children && obj.children.length) {
      obj.children.forEach((child) => fetchAllNestedChildren(child));
    }
  };
  if (categoryTree) {
    categoryTree.categories.items.forEach((op) => {
      fetchAllNestedChildren(op);
    });
  }
  const categoryTreeData = {
    categoryTreeLoading,
    categoryTreeError,
    categoryTree,
    listOfAllChildCategories,
  };

  const config = {
    storeConfig,
    storeWidgets,
    defaultWidgets,
    attributeMeta,
    categoryTreeData,
    websiteConfig,
  };
  return (
    <StoreConfigProvider value={config}>
      {children}
    </StoreConfigProvider>
  );
};

AppData.propTypes = {
  children: PropTypes.element,
};
