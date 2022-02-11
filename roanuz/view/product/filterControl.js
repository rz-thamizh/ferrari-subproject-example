import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Config from '@/config';
import { StyledCheckbox } from '@/roanuz/layout';
import { ReactComponent as DownArrowIcon } from '@/roanuz/view/imgs/DownArrowLineIcon.svg';
import { TextBold16, TextMedium14 } from '@/roanuz/typopgraphy';
import { asRem } from '@/roanuz/lib/css';
import { formatPriceLabel, formatLabel } from '@/roanuz/lib/cart';
import { translate } from '@/roanuz/lib/utils';
import { ReactComponent as CloseIcon } from '@/roanuz/view/imgs/CloseIcon.svg';
import { PriceSliderController } from '@/roanuz/view/category/priceSliderView';
import { SVGIcon } from '../icon';
import { Button } from '../button';

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
        }
        .rz-custom-checkbox input {
          margin: 0;
        }
      }
    }
  }
`;

const ClearFilterWrapper = styled.div`
  border-bottom: ${asRem(1)} solid var(--color-disabled-3);
  padding-bottom: ${asRem(20)};
  margin-bottom: ${asRem(20)};
  >.active-filters {
    padding-top: ${asRem(15)};
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    div.item {
      border: ${asRem(1)} solid var(--color-disabled-3);
      padding: ${asRem(10)};
      border-radius: ${asRem(6)};
      margin: ${asRem(5)} ${asRem(10)} ${asRem(5)} 0;
      display: flex;
      align-items: center;
      >p {
        padding-right: ${asRem(8)};
      }
      >div {
        cursor: pointer;
        color: var(--color-button);
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  >.button-wrap {
    text-align: right;
    >button {
      text-decoration: underline;
      transition: none;
      >span {
        opacity: initial;
      }
    }
  }
`;

export const ClearFilterView = ({
  activeFiltersList,
  onClearAllFilters,
  onClearIndividualFilter,
}) => {
  return (
    <ClearFilterWrapper className="active-filters-list">
      <TextBold16>Virk sía</TextBold16>
      <div className="active-filters">
        {Object.keys(activeFiltersList).map((activeFilter) => (
          <>
            {activeFiltersList[activeFilter].map((item) => (
              <div className="item" key={item.value}>
                <TextMedium14>{item.label}</TextMedium14>
                <SVGIcon heightPx={16}>
                  <CloseIcon
                    onClick={() => onClearIndividualFilter(
                      activeFilter,
                      item.value,
                      activeFilter === 'price',
                    )}
                  />
                </SVGIcon>
              </div>
            ))}
          </>
        ))}
      </div>
      <div className="button-wrap">
        <Button
          onClick={() => onClearAllFilters()}
          noborder
        >
          <TextMedium14>Hreinsa</TextMedium14>
        </Button>
      </div>
    </ClearFilterWrapper>
  );
};

ClearFilterView.propTypes = {
  activeFiltersList: PropTypes.object,
  onClearAllFilters: PropTypes.func,
  onClearIndividualFilter: PropTypes.func,
};

export const FilterControlView = ({
  categoryImmediateChildren,
  filterInput,
  filterResult,
  onFilterUpdate,
  activeFilters,
  onClearAllFilters,
  onClearIndividualFilter,
  onChangeSetActiveFilters,
  onPriceSelectionSetActiveFilters,
  priceSliderReset,
  setPriceSliderReset,
}) => {
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

  const onChange = (field, value, checked, label) => {
    const removeItem = !checked;
    onChangeSetActiveFilters(field, value, checked, label);
    onFilterUpdate({
      field, value, removeItem, op: 'in',
    });
  };

  const onPriceSelection = (field, value, label) => {
    onPriceSelectionSetActiveFilters(field, value, label);
    onFilterUpdate({
      field, value,
    });
  };

  const getCount = (code, value) => {
    const matched = filterResult.aggregations.find((x) => x.attribute_code === code);
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

  filterResult.aggregations.forEach((filterItem) => {
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
    const prepareLabel = `${min}-${max}`;
    onPriceSelection(fItem.attribute_code, prepareValue, prepareLabel);
  };

  return (
    <FilterControlViewWrapper>
      {Object.keys(activeFilters).length ? (
        <ClearFilterView
          activeFiltersList={activeFilters}
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
                          {filterItem.attribute_code === 'price' && (
                            <div
                              className={`item link ${
                                (filterInput.range[filterItem.attribute_code] === item.value)
                                  ? 'selected'
                                  : ''
                              }`}
                              key={`${filterItem.attribute_code} ${item.value}`}
                              onClick={() => onPriceSelection(
                                filterItem.attribute_code, item.value, item.label,
                              )}
                              onKeyDown={() => onPriceSelection(
                                filterItem.attribute_code, item.value, item.label,
                              )}
                              role="presentation"
                            >
                              <label>
                                <span className="price-label">{formatPriceLabel(item.label)}</span>
                              </label>
                              <div className="count">
                                {item.count}
                              </div>
                            </div>
                          )}
                          {specialCases.indexOf(filterItem.attribute_code) === -1
                            && item.count > 0 && (
                            <StyledCheckbox
                              key={`${item.attribute_code || filterItem.attribute_code} ${item.value}`}
                            >
                              <div className="item">
                                <label>
                                  <input
                                    type="checkbox"
                                    value={item.value}
                                    checked={
                                      filterInput
                                        .in[item.attribute_code || filterItem.attribute_code]
                                      && filterInput.in[item.attribute_code
                                        || filterItem.attribute_code]
                                        .indexOf(item.value) > -1
                                    }
                                    onChange={
                                      (event) => onChange(
                                        item.attribute_code || filterItem.attribute_code,
                                        item.value,
                                        event.target.checked,
                                        item.label,
                                      )
                                    }
                                  />
                                  <span>{formatLabel(item.label)}</span>
                                </label>
                                <div className="count">
                                  {item.count}
                                </div>
                              </div>
                            </StyledCheckbox>
                          )}
                        </>
                      ))}
                      {(filterItem.attribute_code === 'price' && Config.EnablePiceSlider) && (
                        <PriceSliderController
                          options={filterItem.options}
                          onChange={
                            ({ min, max }) => onPriceSliderChange(min, max, filterItem)
                          }
                          priceSliderReset={priceSliderReset}
                          onResetPriceFilter={setPriceSliderReset}
                        />
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

FilterControlView.propTypes = {
  filterInput: PropTypes.object,
  filterResult: PropTypes.object,
  onFilterUpdate: PropTypes.func,
  categoryImmediateChildren: PropTypes.array,
  activeFilters: PropTypes.object,
  onClearAllFilters: PropTypes.func,
  onClearIndividualFilter: PropTypes.func,
  onChangeSetActiveFilters: PropTypes.func,
  onPriceSelectionSetActiveFilters: PropTypes.func,
  priceSliderReset: PropTypes.bool,
  setPriceSliderReset: PropTypes.func,
};
