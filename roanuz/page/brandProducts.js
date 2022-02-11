import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { useQuery } from '@apollo/client';

import { StoreConfigConsumer } from '@/store/core/context';
import { CategoryInfoById } from '@/store/category/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { createBrandKey, useBrandList } from '@/roanuz/view/brand/model';
import { parseCategory } from '@/roanuz/view/category/model';
import { SEOHead } from '@/roanuz/document';
import {
  dependencyRegister,
  // eslint-disable-next-line import/no-unresolved
} from '_WEBSITE_KEY_/dep/brand';
// import { CategoryProductsWithFilterController } from '../controller/category/productsWithFilter';
import { CategoryProductsWithFilterControllerV2 } from '../controller/category/filterv2/productsWithFilter';

dependencyRegister();

export const BrandProductsPage = ({
  brand,
  categoryId,
  widgets,
  storeConfig,
}) => {
  const resolvedBrandName = createBrandKey(brand);

  const {
    loading: brandsLoading,
    error: brandsError,
    brands,
  } = useBrandList();

  const {
    loading: categoryLoading,
    error: categoryError,
    data: categoryData,
  } = useQuery(CategoryInfoById, { variables: { id: categoryId } });

  if ((!categoryData) && categoryLoading) return (<PageLoadingView message="Hleð vörur" />);
  if ((!categoryData) && categoryError) return (<PageErrorView error={categoryError} />);
  const category = parseCategory(categoryData.categories.items[0]);

  if ((!brands) && brandsLoading) return (<PageLoadingView message="Hleð síðu" />);
  if ((!brands) && brandsError) return (<PageErrorView error={brandsError} />);

  const matched = brands.filter((x) => x.key === resolvedBrandName);
  if (!matched.length) {
    (<PageErrorView error={{ message: `Vörumerki ${brand} fannst ekki` }} />);
    return null;
  }

  const [brandMeta] = matched;
  let title = brandMeta.name;
  if (typeof window !== 'undefined' && !category) {
    const nextPath = `/brand/${brandMeta.key}/`;
    window.location.href = nextPath;
  }
  let categoryName = null;
  if (category) {
    title = `${title} ${storeConfig.title_separator} ${category.name}`;
    categoryName = category.name;
  }

  const metaDesc = `${categoryName} frá ${brandMeta.name}`;

  return (
    <StoreConfigConsumer>
      {() => (
        <div>
          <Head>
            <title>
              {title}
            </title>
            <meta name="description" content={title} />
          </Head>
          <SEOHead
            title={title}
            desc={metaDesc}
            keywords={`${brandMeta.name} ${categoryName}`}
          />
          <div>
            <CategoryProductsWithFilterControllerV2
              category={category}
              widgets={widgets}
              brandMeta={brandMeta}
              forceFilterView
            />
          </div>
        </div>
      )}
    </StoreConfigConsumer>
  );
};

BrandProductsPage.propTypes = {
  brand: PropTypes.string.isRequired,
  categoryId: PropTypes.string,
  widgets: PropTypes.arrayOf(PropTypes.object).isRequired,
  storeConfig: PropTypes.object.isRequired,
};
