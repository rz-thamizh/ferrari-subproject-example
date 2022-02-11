import React from 'react';
import PropTypes from 'prop-types';
import Config from '@/config';
import { PriceFilterListView } from '@/roanuz/view/category/priceFilterListView';
import { PriceSliderController } from '@/roanuz/view/category/priceSliderView';

export const PriceFilterView = ({
  filterInput,
  filterItem,
  onPriceSelection,
  onPriceSliderChange,
  priceSliderReset,
  onResetPriceFilter,
  ispriceActive,
}) => {
  if (Config.EnablePiceSlider) {
    return (
      <PriceSliderController
        options={filterItem.options}
        onChange={
          ({ min, max }) => onPriceSliderChange(min, max, filterItem)
        }
        priceSliderReset={priceSliderReset}
        onResetPriceFilter={onResetPriceFilter}
        ispriceActive={ispriceActive}
      />
    );
  }
  return (
    <PriceFilterListView
      filterInput={filterInput}
      filterItem={filterItem}
      onPriceSelection={onPriceSelection}
    />
  );
};

PriceFilterView.propTypes = {
  filterInput: PropTypes.object,
  filterItem: PropTypes.object,
  onPriceSelection: PropTypes.func,
  options: PropTypes.object,
  onPriceSliderChange: PropTypes.func,
  priceSliderReset: PropTypes.func,
  onResetPriceFilter: PropTypes.func,
  ispriceActive: PropTypes.bool,
};
