import React from 'react';
import PropTypes from 'prop-types';
import { CategoryPageView } from '@/roanuz/view/category/page';
import { CategoryNavQuery, FeaturedCategories } from '@/store/category/query';
import { useQuery } from '@apollo/client';
import { ErrorView, LoadingView } from '@/roanuz/view/status';
import { ProductCardDisplayMode } from '@/roanuz/layout/product/product';
import { ProductsFeaturedByCategoryController } from '../product/featuredByCatgory';

export const CategoryAutoContentController = ({
  category,
  widgets,
}) => {
  const { loading, data, error } = useQuery(CategoryNavQuery, {
    variables: { parentCategory: category.uid },
  });

  const maxCategoriesToShow = 3;
  const {
    loading: featuredCategoriesLoading,
    data: featuredCategoriesData,
    error: featuredCategoriesError,
  } = useQuery(FeaturedCategories, {
    variables: { parentId: category.id, limit: maxCategoriesToShow },
  });

  if ((!featuredCategoriesData) && featuredCategoriesLoading) return (<LoadingView />);
  if ((!featuredCategoriesData) && featuredCategoriesError) {
    return (<ErrorView error={featuredCategoriesError} />);
  }

  if ((!data) && loading) return (<LoadingView />);
  if ((!data) && error) return (<ErrorView error={error} />);

  const categoryTree = [
    ...data.categories.items,
  ];

  let featuredCategories = featuredCategoriesData.rzFeaturedCategories.categoryList;
  if (featuredCategories.length < maxCategoriesToShow) {
    const skipUrlKeys = [
      ...featuredCategoriesData.rzFeaturedCategories.categoryList.map((op) => op.url_key).flat(),
    ];
    const allOptions = [
      ...data.categories.items,
    ].filter((x) => skipUrlKeys.indexOf(x.url_key) === -1);
    featuredCategories = [...featuredCategories, ...allOptions];
  }

  featuredCategories = featuredCategories.slice(0, maxCategoriesToShow);
  // console.log('featuredCategories', featuredCategories);
  return (
    <CategoryPageView
      category={category}
      widgets={widgets}
      categoryTree={categoryTree}
      featuredCategories={(
        featuredCategories.map((fcategory, i) => (
          <ProductsFeaturedByCategoryController
            key={fcategory.uid}
            category={fcategory}
            displayMode={
              (i === 0) ? ProductCardDisplayMode.OneByThree : ProductCardDisplayMode.OneBySix
            }
            showMoreLinks
            carousel
          />
        ))
      )}
    />
  );
};

CategoryAutoContentController.propTypes = {
  category: PropTypes.object.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
};
