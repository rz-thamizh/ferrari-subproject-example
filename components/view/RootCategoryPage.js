import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import { RootCategoriesQuery } from '@/store/category/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import {
  dependencyRegister,
  // eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/category';
import CategoryPage from './CategoryPage';

dependencyRegister();

const RootCategoryPage = ({ widgets, storeConfig }) => {
  const {
    loading: pageLoading,
    error: pageError,
    data,
  } = useQuery(RootCategoriesQuery);

  if ((!data) && pageLoading) return (<PageLoadingView message="Hleð vörur" />);
  if ((!data) && pageError) return (<PageErrorView error={pageError} />);
  const categoryUid = data.categories.items[0].uid;
  const urlMeta = {
    redirectCode: 0,
    entity_uid: categoryUid,
    type: 'CATEGORY',
  };

  return (
    <CategoryPage
      urlMeta={urlMeta}
      widgets={widgets}
      storeConfig={storeConfig}
    />
  );
};

RootCategoryPage.propTypes = {
  widgets: PropTypes.arrayOf(PropTypes.object).isRequired,
  storeConfig: PropTypes.object.isRequired,
};

export default RootCategoryPage;
