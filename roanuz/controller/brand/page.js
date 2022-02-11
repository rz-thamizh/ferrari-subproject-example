import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import { LoadingView, ErrorView } from '@/roanuz/view/status';
import { BrandCategoriesList } from '@/store/brand/query';
import { FeaturedCategories } from '@/store/category/query';
import { BrandPageView } from '@/roanuz/view/brand/page';
import { ProductCardDisplayMode } from '@/roanuz/layout/product/product';
import { StoreConfigContext } from '@/store/core/context';
import { ProductsFeaturedByCategoryController } from '../product/featuredByCatgory';

export const BrandPageController = ({
  brandMeta,
  widgets,
  categoryTreeData,
}) => {
  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(BrandCategoriesList, { variables: { brandId: brandMeta.id } });

  const maxCategoriesToShow = 3;
  const storeConfigContext = useContext(StoreConfigContext);
  const {
    loading: featuredCategoriesLoading,
    data: featuredCategoriesData,
    error: featuredCategoriesError,
  } = useQuery(FeaturedCategories, {
    variables: { storeCode: storeConfigContext.storeConfig.store_code, limit: maxCategoriesToShow },
  });

  if ((!featuredCategoriesData) && featuredCategoriesLoading) return (<LoadingView />);
  if ((!featuredCategoriesData) && featuredCategoriesError) {
    return (<ErrorView error={featuredCategoriesError} />);
  }

  const featuredCategoriesIds = [
    ...featuredCategoriesData.rzFeaturedCategories.categoryList.map((op) => op.id).flat(),
  ];
  if ((!categoriesData) && categoriesLoading) return (<LoadingView message="Fetching brand categories" />);
  if ((!categoriesData) && categoriesError) return (<ErrorView error={categoriesError} />);

  let categories = [];
  const matched = categoriesData.products.aggregations.filter((x) => x.attribute_code === 'category_id');
  if (matched.length) {
    categories = matched[0].options.map(
      (opt) => ({
        id: opt.value,
        name: opt.label,
        count: opt.count,
        rank: featuredCategoriesIds.includes(parseInt(opt.value, 10)) ? 0 : 1,
      }),
    );
  }
  categories = categories.filter((x) => categoryTreeData
    .listOfAllChildCategories.includes(parseInt(x.id, 10)));
  categories = categories.sort((x, y) => x.rank - y.rank);
  const featuredCategories = categories.slice(0, maxCategoriesToShow);

  return (
    <BrandPageView
      brandMeta={brandMeta}
      widgets={widgets}
      brandCategories={categories}
      featuredCategories={(
        featuredCategories.map((category, i) => (
          <ProductsFeaturedByCategoryController
            key={category.id}
            categoryId={category.id}
            categoryName={category.name}
            brandMeta={brandMeta}
            displayMode={
              (i === 0) ? ProductCardDisplayMode.OneByThree : ProductCardDisplayMode.OneBySix
            }
            showMoreLinks
            carousel={(i !== 0)}
          />
        ))
      )}
    />
  );
};

BrandPageController.propTypes = {
  brandMeta: PropTypes.object.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
  categoryTreeData: PropTypes.object.isRequired,
};
