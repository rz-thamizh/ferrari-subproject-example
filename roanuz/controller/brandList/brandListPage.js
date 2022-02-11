import React from 'react';
import Config from '@/config';
import PropTypes from 'prop-types';
import { BrandListView } from '@/roanuz/view/brandList/brandList';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { useQuery } from '@apollo/client';
import { BrandsListQuery } from '@/store/brand/query';

export const BrandListPageController = ({ attributeMeta }) => {
  const initFilterQuery = {
    rz_visible_websites: {},
  };
  if (Config.RestrictProductByWebsite && attributeMeta.rzVisibleProdcutOnWebsiteCode) {
    initFilterQuery.rz_visible_websites.eq = attributeMeta.rzVisibleProdcutOnWebsiteCode;
  }
  const {
    data: aggregationsList,
    loading, error,
  } = useQuery(BrandsListQuery, {
    variables: { filterQuery: initFilterQuery },
  });

  if (loading) return (<PageLoadingView message="Hleð síðu" />);
  if (error) return (<PageErrorView error={error} />);

  const { aggregations } = aggregationsList.products;
  const brandsList = aggregations && aggregations.filter((x) => x.attribute_code === 'rz_manufacturer');
  const [listOfBrands] = brandsList;
  if (
    !listOfBrands
    || !listOfBrands.options
    || listOfBrands.options.length === 0
  ) {
    return (
      <PageErrorView error={{ message: 'Engin vörumerki' }} />
    );
  }
  return (
    <BrandListView brands={listOfBrands.options} />
  );
};

BrandListPageController.propTypes = {
  attributeMeta: PropTypes.object,
};
