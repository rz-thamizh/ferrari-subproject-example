import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Text14, TextBold14 } from '@/roanuz/typopgraphy';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { ProductGrid } from '@/roanuz/controller/product/list';
import { Pagination } from '@/roanuz/view/product/pagination';
import Config from '@/config';
import { BouncingBallKF } from '@/roanuz/view/statefulView';
import { ReactComponent as RightArrowIcon } from '@/roanuz/view/imgs/RightArrow.svg';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { Button } from '../button';
import { ReactComponent as FilterSVG } from '../imgs/FilterSVG.svg';
import { SVGIcon, CircleIcon } from '../icon';

export const BaseProductsWithPageWrapper = styled.div`
  >.sort-line {
    padding-bottom: ${asRem(20)};
    border-bottom: 1px solid var(--color-disabled-3);
    margin-bottom: ${asRem(40)};

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    >.right {
      width: 100%;
      
      @media screen and (min-width: ${Breakpoint.sm}) {
        display: flex;
        align-items: center;
        width: auto;
      }
      span {
        display: block;
        margin-bottom: ${asRem(8)};

        @media screen and (min-width: ${Breakpoint.sm}) {
          display: inline-block;
          margin-bottom: 0;
        }
      }

      .select-container {
        background-color: var(--color-text-rev);
        display: flex;
        align-items: center;
        svg {
          transform: rotate(90deg);
        }
        @media screen and (min-width: ${Breakpoint.sm}) {
          min-width: ${asRem(150)};
        }
        position: relative;
        .rz-svg-icon {
          display: inherit;
          position: absolute;
          right: ${asRem(15)};

          @media screen and (min-width: ${Breakpoint.sm}) {
            right: ${asRem(50)};
          }
        }
      }

      select {
        width: 100%;
        background-color: transparent;
        border: 0;
        outline: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        -o-appearance: none;
        appearance: none;
        margin: 0;
        border-radius: 0;
        font-size: ${asRem(14)};
        position: relative;
        z-index: 99;
        padding: ${asRem(10)} 0;
      }

      select::-ms-expand { 
        display: none; /* remove default arrow on ie10 and ie11 */
      }
    }

    >.mobile-filter-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: ${asRem(16)};

      @media screen and (min-width: ${Breakpoint.sm}) {
        width: auto;
        margin-bottom: 0;
      }

      .rz-button {
        @media screen and (min-width: ${Breakpoint.sm}) {
          display: none;
        }
        span {
          display: flex;
          align-items: center;
        }
      }

      .mobile-filter {
        background-color: var(--color-text-rev);
      }
    }

    .status {
      margin: auto;

      .rz-svg-icon {
        height: ${asRem(10)};
        line-height: 0;
        padding: 0;
        animation: ${BouncingBallKF} 1s cubic-bezier(0.36, 0, 0.66, -0.56) infinite alternate;
        animation-delay: 350ms;
      }
    }
  }

  .products-page {
    margin-top: ${asRem(10)};
    text-align: center;
    @media screen and (min-width: ${Breakpoint.sm}) {
      text-align: right;
    }
  }

  .products-line {
    .container-action {
      > div {
        display: inline-flex !important;
        .rz-button-atw.rz-button-wrapper {
          margin-top: 0;
          margin-left: ${asRem(10)};
        }
      }
    }
  }
`;

export const BaseProductsWithPage = ({
  filterResult,
  sortInput,
  onSortUpdate,
  filterLoading,
  onPageChange,
  onOpenFilterModal,
  isSearchResultPage,
}) => {
  const totalItems = filterResult.total_count;
  const currentPage = filterResult.page_info.current_page;
  const pageSize = filterResult.page_info.page_size;
  const totalPages = filterResult.page_info.total_pages;
  const itemsFrom = ((currentPage - 1) * pageSize) + 1;
  const itemsTo = itemsFrom + filterResult.items.length - 1;

  const defaultField = sortInput.field || filterResult.sort_fields.default;
  const selectedKey = sortInput.isAsc ? defaultField : `${defaultField}Desc`;

  const sortFieldsOptionsRef = [...filterResult.sort_fields.options];

  const isRelevanceEnabled = Config.categoryFilter.enableRelevanceSortItem;
  if (isRelevanceEnabled && isSearchResultPage) {
    sortFieldsOptionsRef.push({
      label: Config.categoryFilter.sortOptions.relevance.label,
      value: Config.categoryFilter.sortOptions.relevance.id,
    });
  }
  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push({ value: i, label: `${i}` });
  }

  // const selectedSort = useState({
  //   key: selectedKey,
  //   field: defaultField,
  //   isAsc: sortInput.isAsc,
  //   value: defaultField.value,
  // });
  const sortItems = [];
  const categoryConfig = Config.categoryFilter;
  sortFieldsOptionsRef.forEach((item) => {
    const items = [];

    [true, false].forEach((isAsc) => {
      const key = (isAsc) ? item.value : `${item.value}Desc`;
      const sortConfig = categoryConfig.sortOptions[key] || {};
      if (sortConfig.disabled) return;

      const defaultSuffix = ((isAsc) ? '' : ' (DESC)');
      const value = (isAsc) ? item.label : `${item.label}-`;
      const suffix = (sortConfig.suffix === undefined) ? defaultSuffix : sortConfig.suffix;
      const label = sortConfig.label || `${item.label}${suffix}`;

      items.push({
        field: item.value,
        key,
        isAsc,
        label,
        value,
      });
    });

    sortItems.push(
      ...items,
    );
  });

  const onChange = (event) => {
    const { value } = event.target;
    const item = sortItems.find((x) => x.key === value);
    onSortUpdate(item.field, item.isAsc);
  };

  const selectPage = (value) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    onPageChange(value);
  };

  return (
    <ProductsWithPageWrapper>
      <div className="sort-line">
        <div className="mobile-filter-container">
          <div className="left">
            <Text14 as="span">
              Sýni&nbsp;
              {itemsFrom}
              -
              {itemsTo}
              &nbsp;af&nbsp;
              {totalItems}
            </Text14>
            <TextBold14 as="span">&nbsp;vörum</TextBold14>
          </div>
          <Button
            noborder
            className="mobile-filter"
            onClick={() => onOpenFilterModal && onOpenFilterModal()}
          >
            <SVGIcon
              heightPx={16}
            >
              <FilterSVG />
            </SVGIcon>
            Sía
          </Button>
        </div>
        <div className="status">
          {filterLoading && (
            <CircleIcon />
          )}
        </div>
        <div className="right">
          <Text14 as="span">Raða eftir:&nbsp;</Text14>
          <div className="select-container">
            <select
              value={selectedKey}
              onChange={onChange}
            >
              {sortItems.map((item) => (
                <option
                  key={item.key}
                  value={item.key}
                >
                  {item.label}
                </option>
              ))}
            </select>
            <SVGIcon
              heightPx={10}
            >
              <RightArrowIcon />
            </SVGIcon>
          </div>
        </div>
      </div>
      <div className="products-line">
        <ProductGrid
          products={filterResult.items}
          autoFit
          withBorder
          showShortDesc
        />
      </div>
      <div className="products-page">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChanged={(value) => selectPage(value)}
          />
        )}
      </div>
    </ProductsWithPageWrapper>
  );
};

BaseProductsWithPage.propTypes = {
  filterResult: PropTypes.object,
  sortInput: PropTypes.object,
  onSortUpdate: PropTypes.func,
  filterLoading: PropTypes.bool,
  onPageChange: PropTypes.func,
  onOpenFilterModal: PropTypes.func,
  isSearchResultPage: PropTypes.bool,
};

export const ProductsWithPageWrapper = withDependencySupport(BaseProductsWithPageWrapper, 'ProductsWithPageWrapper');
export const ProductsWithPage = withDependencySupport(BaseProductsWithPage, 'ProductsWithPage');
