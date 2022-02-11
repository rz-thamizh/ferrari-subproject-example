import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { CategoryProductsWithFilterLayout } from '@/roanuz/layout/category/productsWithFilter';
import { ProductsWithPage } from '@/roanuz/view/product/productsWithPage';
import { FilterControlView, ClearFilterView } from '@/roanuz/view/product/filterControl';
import { MobileFilterView } from '@/roanuz/view/mobileFilterView';
import { formatPriceLabel, formatLabel } from '@/roanuz/lib/cart';

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

export const CategoryProductsWithFilterView = ({
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
}) => {
  const [mobileFilterVisible, setMobileFilterVisible] = useState(false);

  const [activeFilters, setActiveFilters] = useState({});

  const onChangeSetActiveFilters = (field, value, checked, label) => {
    const removeItem = !checked;
    setActiveFilters((state) => {
      const updates = { ...state };
      if (removeItem) {
        updates[field] = updates[field].filter((v) => v.value !== value);
        if (!updates[field].length) {
          delete updates[field];
        }
      } else {
        if (!Object.keys(updates).includes(field)) {
          updates[field] = [];
        }
        updates[field].push({ label: formatLabel(label), value });
      }
      return updates;
    });
  };

  const onPriceSelectionSetActiveFilters = (field, value, label) => {
    setActiveFilters((state) => {
      const updates = { ...state };
      if (Object.values(updates).includes(field)) {
        delete updates[field];
      } else {
        updates[field] = [];
        updates[field].push({ label: formatPriceLabel(label), value });
      }
      return updates;
    });
  };

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
    setActiveFilters((state) => {
      const updates = { ...state };
      updates[field] = updates[field].filter((v) => v.value !== value);
      if (!updates[field].length) {
        delete updates[field];
      }
      return updates;
    });
    onFilterUpdate({ ...filterRef });
  };

  const onClearAllFilters = () => {
    setActiveFilters({});
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
      <FilterControlView
        filterInput={filterInput}
        filterResult={filterResult}
        onFilterUpdate={onFilterUpdate}
        categoryImmediateChildren={categoryImmediateChildren}
        activeFilters={activeFilters}
        onClearAllFilters={onClearAllFiltersCtrl}
        onClearIndividualFilter={onClearIndividualFilterCtrl}
        onChangeSetActiveFilters={onChangeSetActiveFilters}
        onPriceSelectionSetActiveFilters={onPriceSelectionSetActiveFilters}
        priceSliderReset={priceSliderReset}
        setPriceSliderReset={() => setPriceSliderReset(false)}
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
  if (Object.keys(activeFilters).length) {
    activeFiltersList = (
      <ClearFilterView
        activeFiltersList={activeFilters}
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

CategoryProductsWithFilterView.propTypes = {
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
};
