import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { ProductsFilterQuery } from '@/store/product/product.graphql';
import { useRouter } from 'next/router';
import { CategoryPageView } from '@/roanuz/view/category/page';
import { useLazyQuery, useQuery } from '@apollo/client';
import { ErrorView, LoadingView } from '@/roanuz/view/status';
import { CategoryImmediateChildQuery } from '@/store/category/query';
import {
  StoreConfigContext,
  // UserContext,
} from '@/store/core/context';
import { useWaitForClientSide } from '@/roanuz/hooks/core';
import Config from '@/config';
import {
  parseRouterFilterItems,
  parseInitialAggregationItemCount,
  mergeAggregation,
} from '@/roanuz/view/category/filterv2/model';

export const CategoryProductsWithFilterControllerV2 = ({
  category,
  widgets,
  defaultFilters,
  searchText = null,
  titleText = null,
  brandMeta,
  forceFilterView,
  isSearchResultPage,
}) => {
  const router = useRouter();
  const storeConfig = useContext(StoreConfigContext);
  const showFilter = forceFilterView || (
    category.display_mode === null
    || category.display_mode === 'PRODUCTS_AND_PAGE'
    || category.display_mode === 'PRODUCTS'
  );

  const productsPerPage = {
    att: 20,
    tl: 20,
  };

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

  const isRelevanceEnabled = Config.categoryFilter.enableRelevanceSortItem;
  if (isSearchResultPage && isRelevanceEnabled) {
    initSortBy.field = Config.categoryFilter.sortOptions.relevance.id;
    // By default the query sorts by relevance, in descending order.
    // But assigned 1 below to satisfy other internal logics.
    initSortBy.isAsc = true;
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

  const [
    defaultSortRelevance,
    setDefaultSortRelevance,
  ] = useState(isSearchResultPage && isRelevanceEnabled);
  const buildQueryVariables = (query, skipSort = false) => {
    const filterQuery = {};
    let sortQuery = {};
    if (sortInput.field) {
      sortQuery[sortInput.field] = sortInput.isAsc ? 'ASC' : 'DESC';
    }
    if (skipSort || (defaultSortRelevance && isRelevanceEnabled)) {
      sortQuery = {};
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
      pageSize: productsPerPage[Config.WebsiteKey] || 21,
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
  // const userContext = useContext(UserContext);

  const [aggregationsItemCounts, setAggregationsItemCounts] = useState({});
  const [activeFilter, setActiveFilter] = useState('');
  const {
    data: aggregationsList,
  } = useQuery(ProductsFilterQuery, {
    variables: { ...buildQueryVariables(initFilterQuery, true), searchText },
  });

  const prepareAggrgationItemCounts = (params) => {
    if (aggregationsList.products
      && aggregationsList.products.aggregations
      && aggregationsList.products.aggregations.length > 0
    ) {
      const initialCounts = parseInitialAggregationItemCount(
        aggregationsList.products.aggregations,
        params,
      );
      setAggregationsItemCounts((state) => ({
        ...state,
        ...initialCounts,
      }));
    }
  };

  if (aggregationsList && !Object.keys(aggregationsItemCounts).length) {
    prepareAggrgationItemCounts();
  }

  useEffect(() => {
    if (aggregationsList && !Object.keys(aggregationsItemCounts).length) {
      prepareAggrgationItemCounts();
    }
  }, [aggregationsList]);

  const initPageFilters = parseRouterFilterItems(router);
  const isPrice = initPageFilters.price;
  const isPage = initPageFilters.page;
  delete initPageFilters.undefined;

  const excludeParams = ['page', 'q'];
  let initPageFilterKeys = Object.keys(initPageFilters);
  const aggregationKeys = [];
  if (
    aggregationsList
    && aggregationsList.products
    && aggregationsList.products.aggregations
    && aggregationsList.products.aggregations.length > 0
  ) {
    const data = JSON.stringify(aggregationsList.products.aggregations);
    JSON.parse(data, (key, value) => {
      if (typeof (value) !== 'object' && key === 'attribute_code') {
        aggregationKeys.push(value);
      }
    });
  }
  if (initPageFilterKeys.includes('q')) {
    delete initPageFilters.q;
  }
  if (initPageFilterKeys.includes('page')) {
    delete initPageFilters.page;
  }
  if (initPageFilterKeys.includes('q') || initPageFilterKeys.includes('page')) {
    initPageFilterKeys = initPageFilterKeys.filter((e) => !excludeParams.includes(e));
  }
  if (isPrice) {
    initFilterQuery.range.price = isPrice;
  }

  initPageFilterKeys.forEach((param) => {
    if (!aggregationKeys.includes(param)) {
      delete initPageFilters[param];
    }
    if (param !== 'price' && param !== 'page' && param !== 'q') {
      const paramsList = initPageFilters[param];
      if (paramsList) {
        initFilterQuery.in[param] = paramsList.split(',');
      }
    }
  });

  // First time if URL lands with query params
  useEffect(() => {
    if (activeFilter === '' && initPageFilterKeys.length > 0 && aggregationsList) {
      // let params = initPageFilterKeys;
      // const excludes = ['page', 'q'];
      // if (params.includes('q') || params.includes('page')) {
      //   params = params.filter((e) => !excludes.includes(e));
      // }
      setActiveFilter(initPageFilterKeys[0]);
      // prepareAggrgationItemCounts(initPageFilterKeys[0]);
    }
  }, []);

  const {
    loading, data, error,
    // refetch,
  } = useQuery(ProductsFilterQuery, {
    variables: {
      ...buildQueryVariables(initFilterQuery),
      searchText,
      currentPage: isPage ? parseInt(isPage, 10) : 1,
    },
  });

  // Temporarly Commenting / Hiding
  // useEffect(() => {
  //   if (clientReady && userContext.token && Config.EnableClientSideRefresh) {
  //     refetch();
  //     setFilterResult({ ...data.products });
  //   }
  // }, [clientReady, refetch]);

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

  const [forceReWritingCount, setForceReWritingCount] = useState(false);
  const onLiveUpdate = (liveUpdate) => {
    const { aggregations } = liveUpdate;
    const updatedCounts = mergeAggregation(
      aggregationsItemCounts,
      aggregations,
      activeFilter,
      initPageFilters,
      forceReWritingCount,
    );
    setAggregationsItemCounts((state) => ({
      ...state,
      ...updatedCounts,
    }));
  };

  useEffect(() => {
    const params = Object.keys(initPageFilters);
    if (params.length === 1 && activeFilter === '' && !forceReWritingCount) {
      prepareAggrgationItemCounts(params[0]);
      setForceReWritingCount(true);
    }
  }, [initPageFilters, activeFilter]);

  useEffect(() => {
    if (filterResult
      && filterResult.aggregations
      && Object.keys(aggregationsItemCounts).length > 0) {
      onLiveUpdate({ ...filterResult });
    }
  }, [filterResult]);

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
    if (lastSearchText === searchText) {
      return;
    }
    setLastSearchText(searchText);
    console.log('Search Update', searchText);
    const pageNum = (filterInput.page) ? parseInt(filterInput.page, 10) : 1;
    const variables = {
      ...buildQueryVariables(filterInput),
      currentPage: pageNum,
      searchText,
    };
    productFilterFetch({ variables });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchText,
  ]);

  const updateRouterQueryParams = (clear, op, field, value, shouldRemove) => {
    if (shouldRemove) {
      let queryParamsList = router.query[field] && router.query[field].split(',');
      if (queryParamsList && queryParamsList.length) {
        const index = queryParamsList.indexOf(value);
        queryParamsList.splice(index, 1);
        if (queryParamsList.length) {
          queryParamsList = queryParamsList.join(',');
        } else {
          delete router.query[field];
        }

        router.query[field] = queryParamsList;
      }
    } else if (op === 'in') {
      if (router.query[field]) {
        router.query[field] = `${router.query[field]},${value}`;
      } else {
        router.query[field] = value;
      }
    } else if (op === 'eq' || field === 'price') {
      router.query[field] = value;
    } else if (field === 'page') {
      router.query.page = value;
    }

    if (clear) {
      const paramsToClear = [...initPageFilterKeys, 'undefined'];
      Object.keys(router.query)
        .forEach((key) => paramsToClear.includes(key) && delete router.query[key]);
    }

    router.replace(router, null, { shallow: true });
  };

  const onFilterUpdate = ({
    field, value, removeItem, op = 'eq', clear = false,
  }) => {
    if (!removeItem) {
      setActiveFilter(field);
    } else {
      setActiveFilter('');
    }
    if (forceReWritingCount) {
      setForceReWritingCount(false);
    }
    let updates = { ...filterInput, updated: true, page: 1 };
    if (field === 'price') {
      // TODO: this should based on actual attribute.
      if (updates.range[field] === value) {
        delete updates.range[field];
        updateRouterQueryParams(clear, null, field, value, true);
        setActiveFilter('');
      } else {
        updates.range[field] = value;
        updateRouterQueryParams(clear, null, field, value, false);
        setActiveFilter(field);
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
      updateRouterQueryParams(clear, op, field, value, removeItem);
    } else if (op === 'eq') {
      if (removeItem) {
        delete updates[op][field];
      } else {
        updates[op][field] = value;
      }
      updateRouterQueryParams(clear, op, field, value, removeItem);
    }
    if (clear) {
      updates = { ...initFilterQuery, updated: true };
      updateRouterQueryParams(clear);
    }
    setFilterInput(updates);
  };

  const onSortUpdate = (field, isAsc) => {
    const isRelevance = field === Config.categoryFilter.sortOptions.relevance.id;
    if (isRelevanceEnabled && isSearchResultPage) {
      setDefaultSortRelevance(isRelevance);
    }
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
    updateRouterQueryParams(null, null, 'page', page);
  };

  // Lame approach but 🤷‍♀️ - for now
  useEffect(() => {
    const errorMessage = error && error.message;
    if (
      errorMessage === `currentPage value ${isPage} specified is greater than the 1 page(s) available.`
      || (errorMessage && errorMessage.includes(`currentPage value ${isPage} specified is greater than the`))
    ) {
      updateRouterQueryParams(null, null, 'page', isPage, true);
    }
  }, [error]);

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
      filterLoading={filterLoading || loading}
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
      initialAggregations={aggregationsList.products}
      aggregationsItemCounts={aggregationsItemCounts}
      initPageFilters={initPageFilters}
      activeFilter={activeFilter}
      isSearchResultPage={isSearchResultPage}
    />
  );
};

CategoryProductsWithFilterControllerV2.propTypes = {
  category: PropTypes.object.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
  defaultFilters: PropTypes.object,
  searchText: PropTypes.string,
  titleText: PropTypes.string,
  brandMeta: PropTypes.object,
  forceFilterView: PropTypes.bool,
  isSearchResultPage: PropTypes.bool,
};
