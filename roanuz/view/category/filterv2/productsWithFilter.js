import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { CategoryProductsWithFilterLayout } from '@/roanuz/layout/category/productsWithFilter';
import { ProductsWithPage } from '@/roanuz/view/product/productsWithPage';
import { MobileFilterView } from '@/roanuz/view/mobileFilterView';
import { FilterControlViewV2 } from './filterControl';
import { ClearFilterView } from './clearFilterView';

const CategoryProductsWithFilterViewWrapper = styled.div`
  >.fitlerview-cms-content {
    margin-bottom: ${asRem(20)};
    .rz-magento-html {
      img {
        max-width: 100%;
      }
    }
  }
`;

export const CategoryProductsWithFilterViewV2 = ({
  category,
  filterResult,
  filterLoading,
  filterError,
  filterInput,
  sortInput,
  onFilterUpdate,
  onSortUpdate,
  onPageChange,
  contentTopWidgets,
  contentBottomWidgets,
  imageView,
  cmsContentView,
  forceFilterView,
  categoryImmediateChildren,
  initialAggregations,
  aggregationsItemCounts,
  initPageFilters,
  activeFilter,
  isSearchResultPage,
}) => {
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false);

  const onClearIndividualFilter = (field, value, isPrice) => {
    let filterRef = {
      field, value,
    };
    if (!isPrice) {
      const removeItem = true;
      filterRef = {
        field, value, removeItem, op: 'in',
      };
    }
    onFilterUpdate({ ...filterRef });
  };

  const onClearAllFilters = () => {
    onFilterUpdate({ clear: true });
  };

  const onOpenFilterModal = () => {
    setMobileFilterVisible(true);
  };
  const onCloseFilterModal = () => {
    setMobileFilterVisible(false);
  };
  const filterContent = (
    <ProductsWithPage
      filterResult={filterResult}
      sortInput={sortInput}
      onSortUpdate={onSortUpdate}
      filterLoading={filterLoading}
      onPageChange={onPageChange}
      onOpenFilterModal={onOpenFilterModal}
      isSearchResultPage={isSearchResultPage}
    />
  );

  let mainContent = null;
  if ((!forceFilterView) && category && category.showStaticContent) {
    mainContent = (
      <>
        {filterContent}
      </>
    );
  } else {
    mainContent = filterContent;
  }

  const [priceSliderReset, setPriceSliderReset] = useState(false);

  const onClearAllFiltersCtrl = () => {
    onClearAllFilters();
    setPriceSliderReset(true);
  };

  const onClearIndividualFilterCtrl = (aFilter, value, isPrice) => {
    onClearIndividualFilter(aFilter, value, isPrice);
    if (isPrice) {
      setPriceSliderReset(true);
    }
  };

  let filter = null;
  let mobileFilterView = null;
  if (forceFilterView || category.showFilter) {
    filter = (
      <FilterControlViewV2
        filterInput={filterInput}
        filterResult={filterResult}
        onFilterUpdate={onFilterUpdate}
        categoryImmediateChildren={categoryImmediateChildren}
        onClearAllFilters={onClearAllFiltersCtrl}
        onClearIndividualFilter={onClearIndividualFilterCtrl}
        priceSliderReset={priceSliderReset}
        setPriceSliderReset={() => setPriceSliderReset(false)}
        initialAggregations={initialAggregations}
        aggregationsInfo={aggregationsItemCounts}
        initPageFilters={initPageFilters}
        activeFilter={activeFilter}
      />
    );
    mobileFilterView = (
      <MobileFilterView
        filter={filter}
        mobileFilterVisible={mobileFilterVisible}
        onCloseFilterModal={onCloseFilterModal}
      />
    );
  }

  let activeFiltersList = null;
  if (Object.keys(initPageFilters).length) {
    activeFiltersList = (
      <ClearFilterView
        activeFiltersList={initPageFilters}
        aggregationsInfo={aggregationsItemCounts}
        onClearAllFilters={onClearAllFiltersCtrl}
        onClearIndividualFilter={onClearIndividualFilterCtrl}
      />
    );
  }

  return (
    <CategoryProductsWithFilterViewWrapper>
      {cmsContentView && (
        <div className="fitlerview-cms-content">
          {cmsContentView}
        </div>
      )}
      <CategoryProductsWithFilterLayout
        activeFiltersList={activeFiltersList}
        content={mainContent}
        imageView={imageView}
        contentTopWidgets={contentTopWidgets}
        contentBottomWidgets={contentBottomWidgets}
        filter={filter}
        mobileFilterView={mobileFilterView}
      />
    </CategoryProductsWithFilterViewWrapper>
  );
};

CategoryProductsWithFilterViewV2.propTypes = {
  category: PropTypes.object.isRequired,
  filterResult: PropTypes.object,
  filterLoading: PropTypes.bool,
  filterError: PropTypes.object,
  filterInput: PropTypes.object,
  sortInput: PropTypes.object,
  onFilterUpdate: PropTypes.func,
  onSortUpdate: PropTypes.func,
  onPageChange: PropTypes.func,
  contentTopWidgets: PropTypes.element,
  contentBottomWidgets: PropTypes.element,
  imageView: PropTypes.element,
  cmsContentView: PropTypes.element,
  forceFilterView: PropTypes.bool,
  categoryImmediateChildren: PropTypes.array,
  initialAggregations: PropTypes.object,
  aggregationsItemCounts: PropTypes.object,
  initPageFilters: PropTypes.object,
  activeFilter: PropTypes.bool,
  isSearchResultPage: PropTypes.bool,
};
