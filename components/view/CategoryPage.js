import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useQuery } from '@apollo/client';

import { StoreConfigConsumer } from '@/store/core/context';
import { CategoryQuery } from '@/store/category/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { buildCategoryTitle } from '@/roanuz/view/breadcrumb';
import { CategoryPageController } from '@/roanuz/controller/category/page';
import { parseCategory } from '@/roanuz/view/category/model';
import { SEOHead } from '@/roanuz/document';
import {
  dependencyRegister,
  // eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/category';

dependencyRegister();

const CategoryPage = ({ urlMeta, widgets, storeConfig }) => {
  const categoryUid = urlMeta.entity_uid;
  const {
    loading: pageLoading,
    error: pageError,
    data: pageaData,
  } = useQuery(CategoryQuery, { variables: { id: categoryUid } });

  if ((!pageaData) && pageLoading) return (<PageLoadingView message="Hleð vörur" />);
  if ((!pageaData) && pageError) return (<PageErrorView error={pageError} />);
  const category = parseCategory(pageaData.categories.items[0]);
  // console.log('catgoey', category);
  return (
    <StoreConfigConsumer>
      {() => (
        <div>
          <SEOHead
            title={category.meta_title || buildCategoryTitle(category, storeConfig.title_separator)}
            desc={category.meta_description}
            keywords={category.meta_keywords}
          />
          <Head>
            {category.image && (
              <meta
                property="og:image"
                content={category.image}
                key="og_image"
              />
            )}
          </Head>
          <div>
            <CategoryPageController
              category={category}
              widgets={widgets}
            />
          </div>
        </div>
      )}
    </StoreConfigConsumer>
  );
};

CategoryPage.propTypes = {
  urlMeta: PropTypes.object.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object).isRequired,
  storeConfig: PropTypes.object.isRequired,
};

export default CategoryPage;
