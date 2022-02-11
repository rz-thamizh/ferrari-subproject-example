import React from 'react';
import PropTypes from 'prop-types';
import { LoadingView, ErrorView } from '@/roanuz/view/status';
import { ProductsFilterQuery } from '@/store/product/product.graphql';
import { ProductCardLayout, ProductCardDisplayMode } from '@/roanuz/layout/product/product';
import { useQuery } from '@apollo/client';
import { FeaturedByCategoryView } from '@/roanuz/view/product/featuredByCategory';
import { createBrandLink } from '@/roanuz/view/brand/model';
import { categoryLink } from '@/roanuz/view/category/model';

function featuredProductsQuery({ items, displayMode, carousel } = {}) {
  let pageSize = items;

  if (!items) {
    const pages = 3;
    let itemsPerPage = 5;
    if (displayMode === ProductCardDisplayMode.OneByThree) {
      itemsPerPage = 3;
    } else if (displayMode === ProductCardDisplayMode.OneByTwo) {
      itemsPerPage = 2;
    }

    if (carousel) {
      pageSize = pages * itemsPerPage;
    } else {
      pageSize = itemsPerPage;
    }
  }

  return {
    filterQuery: {},
    sortQuery: { position: 'ASC' },
    pageSize,
  };
}

export const ProductsFeaturedByCategoryController = ({
  categoryId,
  categoryName,
  category,
  brandMeta,
  displayMode,
  showMoreLinks,
  carousel,
  items,
}) => {
  const query = featuredProductsQuery({ items, displayMode, carousel });
  const basedOnUid = category && category.uid !== null && category.uid !== undefined;

  if (basedOnUid) {
    query.filterQuery.category_uid = { eq: category.uid };
  } else {
    query.filterQuery.category_id = { eq: categoryId };
  }
  if (brandMeta) {
    query.filterQuery.rz_manufacturer = { eq: brandMeta.id };
  }
  const { loading, data, error } = useQuery(ProductsFilterQuery, { variables: query });

  if ((!data) && loading) return (<LoadingView message="Fetching categories" />);
  if ((!data) && error) return (<ErrorView error={error} />);

  const name = basedOnUid ? category.name : categoryName;
  let title = name;
  let link = '';
  let linkText = 'Sjá allt';

  if (brandMeta) {
    title = `${name} frá ${brandMeta.name}`;
    linkText = `Sjá allt ${brandMeta.name}'s ${name}`;
    link = createBrandLink(brandMeta.key, categoryId);
  } else if (category) {
    link = categoryLink(category);
  }

  return (
    <FeaturedByCategoryView
      title={title}
      link={link}
      linkText={showMoreLinks ? linkText : ''}
      products={data.products.items}
      displayMode={displayMode}
      carousel={carousel}
    />
  );
};

ProductsFeaturedByCategoryController.propTypes = {
  categoryId: PropTypes.string,
  categoryName: PropTypes.string,
  category: PropTypes.object,
  brandMeta: PropTypes.object,
  displayMode: ProductCardLayout.propTypes.displayMode,
  showMoreLinks: PropTypes.bool,
  carousel: PropTypes.bool,
  items: PropTypes.number,
};
