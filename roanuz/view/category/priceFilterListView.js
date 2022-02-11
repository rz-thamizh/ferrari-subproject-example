import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { formatPriceLabel } from '@/roanuz/lib/cart';
import { asRem } from '@/roanuz/lib/css';

const PriceFilterViewWrapper = styled.div`
.p-item {
  padding-bottom: ${asRem(14)};
  display: flex;
  justify-content: space-between;
  font-size: ${asRem(14)};
  line-height: ${asRem(20)};
  .p-count {
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
      &:not(.p-price-label) {
        padding-left: ${asRem(10)};
      }
    }
  }
  &.p-link {
    &.p-selected {
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
`;

export const PriceFilterListView = ({
  filterInput,
  filterItem,
  onPriceSelection,
}) => {
  return (
    <PriceFilterViewWrapper>
      {filterItem.options
        .slice()
        .sort((x, y) => x.label.localeCompare(y.label, undefined, { numeric: true }))
        .map((item) => (
          <div
            className={`p-item p-link ${
              (filterInput.range[filterItem.attribute_code] === item.value)
                ? 'p-selected'
                : ''
            }`}
            key={`${filterItem.attribute_code} ${item.value}`}
            onClick={() => onPriceSelection(
              filterItem.attribute_code, item.value,
            )}
            onKeyDown={() => onPriceSelection(
              filterItem.attribute_code, item.value,
            )}
            role="presentation"
          >
            <label>
              <span className="p-price-label">{formatPriceLabel(item.label)}</span>
            </label>
            <div className="p-count">
              {item.count}
            </div>
          </div>
        ))}
    </PriceFilterViewWrapper>
  );
};

PriceFilterListView.propTypes = {
  filterInput: PropTypes.object,
  filterItem: PropTypes.object,
  onPriceSelection: PropTypes.func,
  options: PropTypes.object,
};
