import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Config from '@/config';
import { StyledCheckbox } from '@/roanuz/layout';
import { ReactComponent as DownArrowIcon } from '@/roanuz/view/imgs/DownArrowLineIcon.svg';
import { TextBold16 } from '@/roanuz/typopgraphy';
import { asRem } from '@/roanuz/lib/css';
import { formatLabel } from '@/roanuz/lib/cart';
import { translate } from '@/roanuz/lib/utils';
import { ClearFilterView } from '@/roanuz/view/category/filterv2/clearFilterView';
import { PriceFilterView } from '@/roanuz/view/category/priceFilterView';
import { SVGIcon } from '../../icon';

const FilterControlViewWrapper = styled.div`
  >.filter-items {
    display: flex;
    flex-direction: column;
    .group-item {
      padding-top: ${asRem(14)};
      border-bottom: ${asRem(1)} solid var(--color-disabled-3);

      &:first-child {
        padding-top: 0;
      }
      &.categories-group {
        padding-top: 0;
        margin-bottom: ${asRem(14)};
        order: -1;
      }
      .group-title {
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        padding-bottom: ${asRem(14)};

        .rz-svg-icon {
          color: var(--color-disabled);
        }
      }
      .items {
        padding-bottom: ${asRem(20)};
        .item {
          padding-bottom: ${asRem(14)};
          display: flex;
          justify-content: space-between;
          font-size: ${asRem(14)};
          line-height: ${asRem(20)};
          .count {
            color: var(--color-disabled);
            min-width: ${asRem(20)};
            text-align: center;
          }
          label {
            display: flex;
            align-items: center;
            cursor: pointer;

            span {
              display: block;
              &:not(.price-label) {
                padding-left: ${asRem(10)};
              }
            }

            input[type="checkbox"] {
              min-width: ${asRem(16)};
            }
          }
          &.link {
            &.selected {
              font-weight: bold;
            }

            label {
              span {
                text-decoration: underline;
                display: block;
              }
            }
          }
          &.disable-item {
            opacity: 0.5;
            cursor: not-allowed;
            label, input {
              cursor: not-allowed;
            }
          }
        }
        .rz-custom-checkbox input {
          margin: 0;
        }
      }
    }
  }
`;

export const FilterControlViewV2 = ({
  categoryImmediateChildren,
  filterInput,
  filterResult,
  onFilterUpdate,
  onClearAllFilters,
  onClearIndividualFilter,
  priceSliderReset,
  setPriceSliderReset,
  initialAggregations,
  aggregationsInfo,
  initPageFilters,
  activeFilter,
}) => {
  const [
    initialAggregationsState,
    setInitialAggregationsState,
  ] = useState(initialAggregations.aggregations);

  useEffect(() => {
    setInitialAggregationsState(initialAggregations.aggregations);
  }, [initialAggregations]);

  const [ispriceActive, setIsPriceActive] = useState(true);
  useEffect(() => {
    const isLastFilterPrice = activeFilter === 'price';
    setIsPriceActive(isLastFilterPrice);
  }, [activeFilter]);

  useEffect(() => {
    setInitialAggregationsState((state) => {
      const updates = [...state];
      if (filterResult.aggregations.length && updates.length) {
        const updatesIndex = updates.findIndex((up) => up.attribute_code === 'price');
        const filterResultIndex = filterResult.aggregations.findIndex((up) => up.attribute_code === 'price');
        if (updatesIndex) {
          updates[updatesIndex] = filterResult.aggregations[filterResultIndex];
        }
      }
      return updates;
    });
  }, [initialAggregations, filterResult]);

  const defaultGroupCode = '_grouped_defaults';
  const isCategoriesCode = 'category_id';
  const excludeAttributesDisplay = ['rz_visible_websites', 'rz_visible_websites_bucket'];

  const initClosedGroups = [];
  if (Config.categoryFilter.closeDefaults) {
    initClosedGroups.push(defaultGroupCode);
  }

  if (Config.categoryFilter.closePrice) {
    initClosedGroups.push('price');
  }

  const onChange = (field, value, checked) => {
    const removeItem = !checked;
    onFilterUpdate({
      field, value, removeItem, op: 'in',
    });
  };

  const onPriceSelection = (field, value) => {
    onFilterUpdate({
      field, value,
    });
  };

  const getCount = (code, value) => {
    const matched = initialAggregationsState.find((x) => x.attribute_code === code);
    if (matched) {
      const matchedOption = matched.options.find((x) => x.value === value);
      if (matchedOption) {
        return matchedOption.count;
      }
    }
    return 0;
  };

  const buildDefaultOption = (label, code, value) => {
    return {
      count: getCount(code, value),
      label,
      value,
      attribute_code: code,
    };
  };

  const defaultOptions = [
    {
      label: 'Staða',
      attribute_code: '_grouped_defaults',
      kind: 'grouped_defaults',
      options: [
        buildDefaultOption('Nýtt', 'new', '1'),
        buildDefaultOption('B-Vörur', 'rz_b_product', '1'),
        buildDefaultOption('Vörur á tilboði', 'sale', '1'),
      ],
    },
  ];

  const managedOptions = (filterItem) => {
    if (Config.categoryFilter.showOnlyChildLevel && filterItem.attribute_code === 'category_id') {
      return filterItem.options.filter((item) => {
        return categoryImmediateChildren.findIndex(
          (child) => child.id === parseInt(item.value, 10),
        ) > -1;
      });
    }
    if (excludeAttributesDisplay.includes(filterItem.attribute_code)) {
      return [];
    }
    return filterItem.options;
  };

  const skipCodes = [
    ...defaultOptions.map((op) => op.options.map((x) => x.attribute_code)).flat(),
  ];

  const filterOptions = [];

  initialAggregationsState.forEach((filterItem) => {
    const options = managedOptions(filterItem);
    if (options.length > 0) {
      const newItem = {
        ...filterItem,
        options,
      };

      filterOptions.push(newItem);

      if (
        skipCodes.indexOf(filterItem.attribute_code) === -1
        && Config.categoryFilter.closeFilters
        && filterItem.attribute_code !== 'price'
        && filterItem.attribute_code !== isCategoriesCode) {
        initClosedGroups.push(filterItem.attribute_code);
      }
    }
  });

  const specialCases = ['price'];

  const allOptions = [
    ...defaultOptions,
    ...filterOptions,
  ].filter((x) => skipCodes.indexOf(x.attribute_code) === -1);

  const [closedGroups, setClosedGroups] = useState([...initClosedGroups]);

  const toggleGroup = (group) => {
    const index = closedGroups.indexOf(group);
    if (index === -1) {
      setClosedGroups([
        ...closedGroups,
        group,
      ]);
    } else {
      const newItems = closedGroups.filter((x) => x !== group);
      setClosedGroups(newItems);
    }
  };

  const onPriceSliderChange = (min, max, fItem) => {
    const prepareValue = `${min}_${max}`;
    onPriceSelection(fItem.attribute_code, prepareValue);
  };

  const checkEligibleStatus = (fItem, item) => {
    let attrCode = fItem.attribute_code;
    if (attrCode === defaultGroupCode) {
      attrCode = item.attribute_code;
    }
    if (aggregationsInfo
      && aggregationsInfo[attrCode]
      && !aggregationsInfo[attrCode].attributeMissing
      && aggregationsInfo[attrCode][item.value]
      && aggregationsInfo[attrCode][item.value].count > 0) {
      return true;
    }
    return false;
  };

  const getItemCount = (fItem, item) => {
    let attrCode = fItem.attribute_code;
    if (attrCode === defaultGroupCode) {
      attrCode = item.attribute_code;
    }
    if (aggregationsInfo
      && aggregationsInfo[attrCode]
      && !aggregationsInfo[attrCode].attributeMissing
      && aggregationsInfo[attrCode][item.value]) {
      return aggregationsInfo[attrCode][item.value].count;
    }
    return 0;
  };

  return (
    <FilterControlViewWrapper>
      {Object.keys(initPageFilters).length ? (
        <ClearFilterView
          activeFiltersList={initPageFilters}
          aggregationsInfo={aggregationsInfo}
          onClearAllFilters={onClearAllFilters}
          onClearIndividualFilter={onClearIndividualFilter}
        />
      ) : null}
      <div className="filter-items">
        {allOptions.map((filterItem) => (
          <>
            {filterItem.options.findIndex((item) => item.count > 0) > -1 && (
              <div
                key={filterItem.attribute_code}
                className={`group-item ${filterItem.attribute_code === isCategoriesCode ? 'categories-group' : ''}`}
              >
                <div
                  className="group-title"
                  onClick={() => toggleGroup(filterItem.attribute_code)}
                  onKeyDown={() => toggleGroup(filterItem.attribute_code)}
                  role="presentation"
                >
                  <div>
                    <TextBold16>{translate(filterItem.label)}</TextBold16>
                  </div>
                  <div>
                    <SVGIcon
                      heightPx={22}
                      upsideDown={closedGroups.indexOf(filterItem.attribute_code) > -1}
                    >
                      <DownArrowIcon />
                    </SVGIcon>
                  </div>
                </div>
                {closedGroups.indexOf(filterItem.attribute_code) === -1 && (
                  <div className="items">
                    {filterItem.options
                      .slice()
                      .sort((x, y) => x.label.localeCompare(y.label, undefined, { numeric: true }))
                      .map((item) => (
                        <>
                          {specialCases.indexOf(filterItem.attribute_code) === -1
                            && item.count > 0 && (
                            <StyledCheckbox
                              key={`${item.attribute_code || filterItem.attribute_code} ${item.value}`}
                            >
                              <div className={`item ${checkEligibleStatus(filterItem, item) ? '' : 'disable-item'}`}>
                                <label>
                                  <input
                                    type="checkbox"
                                    value={item.value}
                                    checked={
                                      !!((initPageFilters
                                      && initPageFilters[item.attribute_code
                                        || filterItem.attribute_code]
                                      && initPageFilters[item.attribute_code || filterItem.attribute_code].split(',').includes(item.value)))
                                    }
                                    disabled={!checkEligibleStatus(filterItem, item)}
                                    onChange={
                                      (event) => (checkEligibleStatus(filterItem, item)
                                        && onChange(
                                          item.attribute_code || filterItem.attribute_code,
                                          item.value,
                                          event.target.checked,
                                        ))
                                    }
                                  />
                                  <span>{formatLabel(item.label)}</span>
                                </label>
                                <div className="count">
                                  {getItemCount(filterItem, item)}
                                </div>
                              </div>
                            </StyledCheckbox>
                          )}
                        </>
                      ))}
                      {(filterItem.attribute_code === 'price') && (
                        <>
                          <PriceFilterView
                            filterInput={filterInput}
                            filterItem={filterItem}
                            onPriceSelection={onPriceSelection}
                            onPriceSliderChange={onPriceSliderChange}
                            priceSliderReset={priceSliderReset}
                            onResetPriceFilter={setPriceSliderReset}
                            ispriceActive={ispriceActive}
                          />
                        </>
                      )}
                  </div>
                )}
              </div>
            )}
          </>
        ))}
      </div>
    </FilterControlViewWrapper>
  );
};

FilterControlViewV2.propTypes = {
  filterInput: PropTypes.object,
  filterResult: PropTypes.object,
  onFilterUpdate: PropTypes.func,
  categoryImmediateChildren: PropTypes.array,
  onClearAllFilters: PropTypes.func,
  onClearIndividualFilter: PropTypes.func,
  priceSliderReset: PropTypes.bool,
  setPriceSliderReset: PropTypes.func,
  initialAggregations: PropTypes.object,
  aggregationsInfo: PropTypes.object,
  initPageFilters: PropTypes.object,
  activeFilter: PropTypes.bool,
};
