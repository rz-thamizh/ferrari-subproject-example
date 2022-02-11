import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { ProductsFilterQuery } from '@/store/product/product.graphql';
import { CategoryPageView } from '@/roanuz/view/category/page';
import { useLazyQuery, useQuery } from '@apollo/client';
import { ErrorView, LoadingView } from '@/roanuz/view/status';
import { CategoryImmediateChildQuery } from '@/store/category/query';
import { StoreConfigContext, UserContext } from '@/store/core/context';
import { useWaitForClientSide } from '@/roanuz/hooks/core';
import Config from '@/config';

export const CategoryProductsWithFilterController = ({
  category,
  widgets,
  defaultFilters,
  searchText = null,
  titleText = null,
  brandMeta,
  forceFilterView,
}) => {
  const storeConfig = useContext(StoreConfigContext);
  const showFilter = forceFilterView || (
    category.display_mode === null
    || category.display_mode === 'PRODUCTS_AND_PAGE'
    || category.display_mode === 'PRODUCTS'
  );

  const selectedCategory = category && category.id;

  let categoryImmediateChildren = [];
  const {
    loading: categoryListLoading,
    data: categoryList,
  } = useQuery(CategoryImmediateChildQuery, {
    skip: (!Config.categoryFilter.showOnlyChildLevel || (!selectedCategory)),
    variables: {
      parentCategory: category && category.uid,
    },
  });

  if (categoryList) {
    categoryImmediateChildren = categoryList.categories.items;
  }

  const initSortBy = {
    field: storeConfig.storeConfig.catalog_default_sort_by,
    isAsc: true,
  };

  if (category && category.default_sort_by) {
    initSortBy.field = category.default_sort_by;
  }

  if (Config.categoryFilter.defaultSortBy) {
    initSortBy.field = Config.categoryFilter.defaultSortBy;
  }

  const initSortDirection = Config.categoryFilter.defaultSortDirection[initSortBy.field];
  if (initSortDirection !== undefined) {
    initSortBy.isAsc = initSortDirection;
  }

  const [lastSearchText, setLastSearchText] = useState(searchText);
  const [filterResult, setFilterResult] = useState();
  const [sortInput, setSortInput] = useState({
    field: initSortBy.field,
    isAsc: initSortBy.isAsc,
    updated: false,
  });

  let initFilterQuery = {
    in: {},
    eq: {},
    range: {},
  };

  if (defaultFilters) {
    initFilterQuery = { ...defaultFilters };
  }

  if (selectedCategory) {
    initFilterQuery.in.category_id = [selectedCategory];
  }

  if (brandMeta) {
    initFilterQuery.eq.rz_manufacturer = brandMeta.id;
  }

  if (Config.RestrictProductByWebsite && storeConfig.attributeMeta.rzVisibleProdcutOnWebsiteCode) {
    initFilterQuery.eq
      .rz_visible_websites = storeConfig.attributeMeta.rzVisibleProdcutOnWebsiteCode;
  }

  const buildQueryVariables = (query) => {
    const filterQuery = {};
    const sortQuery = {};
    if (sortInput.field) {
      sortQuery[sortInput.field] = sortInput.isAsc ? 'ASC' : 'DESC';
    }

    Object.keys(query.range).forEach((field) => {
      const parts = query.range[field].split('_').map((x) => parseInt(x, 10));
      filterQuery[field] = { from: `${parts[0]}`, to: `${parts[1] - 0.01}` };
    });

    Object.keys(query.eq).forEach((field) => {
      filterQuery[field] = { eq: `${query.eq[field]}` };
    });

    Object.keys(query.in).forEach((field) => {
      let values = [...query.in[field]];

      // Magento treat it as AND operation, so
      // remove the default category
      if (field === 'category_id' && values.length > 1) {
        values = values.filter((x) => x !== selectedCategory);
      }

      values = values.map((x) => `${x}`);

      if (values.length === 1) {
        filterQuery[field] = { eq: values[0] };
      } else if (values.length > 1) {
        filterQuery[field] = { in: values };
      }
    });
    // console.log('Calling FilterUpdates', filterQuery, sortQuery);

    return {
      filterQuery,
      sortQuery,
    };
  };

  const [filterInput, setFilterInput] = useState({
    in: {},
    eq: {},
    range: {},
    page: 1,
    updated: false,
    ...initFilterQuery,
  });

  const clientReady = useWaitForClientSide();
  const userContext = useContext(UserContext);

  const {
    loading, data, error, refetch,
  } = useQuery(ProductsFilterQuery, {
    variables: { ...buildQueryVariables(initFilterQuery), searchText },
  });

  useEffect(() => {
    if (clientReady && userContext.token && Config.EnableClientSideRefresh) {
      refetch();
      setFilterResult({ ...data.products });
    }
  }, [clientReady, refetch]);

  if (data && data.products && (!filterResult)) {
    setFilterResult({ ...data.products });
  }

  useEffect(() => {
    if (clientReady) {
      if (data && data.products) {
        setFilterResult({ ...data.products });
      }
    }
  }, [data]);

  const [
    productFilterFetch,
    { loading: filterLoading, error: filterError, data: filterData },
  ] = useLazyQuery(ProductsFilterQuery);

  useEffect(() => {
    if (filterData && filterData.products) {
      setFilterResult({ ...filterData.products });
    }
  }, [filterData]);

  useEffect(() => {
    let updateRequired = false;
    const updates = { ...filterInput, updated: true };

    const resolvedBrand = filterInput.eq.rz_manufacturer;
    const newBrand = brandMeta && brandMeta.id;

    const resolvedCategory = filterInput.in.category_id || [];
    const newCategory = (category && category.id) ? [category.id] : [];

    if (resolvedBrand !== newBrand) {
      updateRequired = true;
      updates.eq.rz_manufacturer = newBrand;
    }

    if (JSON.stringify(resolvedCategory) !== JSON.stringify(newCategory)) {
      updateRequired = true;
      updates.in.category_id = newCategory;
    }

    if (updateRequired) {
      setFilterInput(updates);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    category, brandMeta,
  ]);

  useEffect(() => {
    if (!filterInput.updated && !sortInput.updated) {
      return;
    }
    const variables = {
      ...buildQueryVariables(filterInput),
      currentPage: filterInput.page || 1,
      searchText,
    };
    productFilterFetch({ variables });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sortInput, filterInput, productFilterFetch,
  ]);

  useEffect(() => {
    if (lastSearchText === searchText) {
      return;
    }
    setLastSearchText(searchText);
    console.log('Search Update', searchText);
    const variables = {
      ...buildQueryVariables(filterInput),
      currentPage: filterInput.page || 1,
      searchText,
    };
    productFilterFetch({ variables });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchText,
  ]);

  const onFilterUpdate = ({
    field, value, removeItem, op = 'eq', clear = false,
  }) => {
    let updates = { ...filterInput, updated: true, page: 1 };
    if (field === 'price') {
      // TODO: this should based on actual attribute.
      if (updates.range[field] === value) {
        delete updates.range[field];
      } else {
        updates.range[field] = value;
      }
    } else if (op === 'in') {
      if (removeItem) {
        updates.in[field] = updates.in[field].filter((v) => v !== value);
      } else {
        if (!updates.in[field]) {
          updates.in[field] = [];
        }

        updates.in[field].push(value);
      }
    } else if (op === 'eq') {
      if (removeItem) {
        delete updates[op][field];
      } else {
        updates[op][field] = value;
      }
    }
    if (clear) {
      updates = { ...initFilterQuery, updated: true };
    }
    setFilterInput(updates);
  };

  const onSortUpdate = (field, isAsc) => {
    setSortInput({
      ...sortInput,
      field,
      isAsc,
      updated: true,
    });
  };

  const onPageChange = (page) => {
    // console.log('Page Change', page);
    setFilterInput({
      ...filterInput,
      updated: true,
      page,
    });
  };

  if (!filterResult && loading) return (<LoadingView />);
  if (error) return (<ErrorView error={error} />);
  if (!filterResult) return (<LoadingView />);
  if (!categoryList && categoryListLoading) return (<LoadingView />);

  return (
    <CategoryPageView
      category={category}
      widgets={widgets}
      showFilter={showFilter}
      filterResult={filterResult}
      filterLoading={filterLoading}
      filterError={filterError}
      filterInput={filterInput}
      sortInput={sortInput}
      onFilterUpdate={onFilterUpdate}
      onSortUpdate={onSortUpdate}
      onPageChange={onPageChange}
      brandMeta={brandMeta}
      forceFilterView={forceFilterView}
      titleText={titleText}
      categoryImmediateChildren={categoryImmediateChildren}
    />
  );
};

CategoryProductsWithFilterController.propTypes = {
  category: PropTypes.object.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
  defaultFilters: PropTypes.object,
  searchText: PropTypes.string,
  titleText: PropTypes.string,
  brandMeta: PropTypes.object,
  forceFilterView: PropTypes.bool,
};
