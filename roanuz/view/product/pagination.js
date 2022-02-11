import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { ReactComponent as LeftArrowIcon } from '@/roanuz/view/imgs/LeftArrow.svg';
import { ReactComponent as RightArrowIcon } from '@/roanuz/view/imgs/RightArrow.svg';
import { Button } from '../button';

const PaginationWrapper = styled.div`
  .dots {
    display: inline-block;
    vertical-align: text-top;
    margin: 0 ${asRem(5)};
  }
  .action-button {
    svg {
      height: ${asRem(10)};
    }
  }
  button {
    background: #fff;
    border: 1px solid var(--color-disabled-3);
    padding: ${asRem(5)} ${asRem(13)};
    border-radius: ${asRem(6)};
    margin: 0 ${asRem(5)};
    width: ${asRem(32)};
    display: inline-flex;
    justify-content: center;
    &.active {
      color: var(--color-text);
      cursor: not-allowed;
    }
    .rz-svg-icon {
      height: auto;
      padding: 0;
    }
  }
`;

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChanged,
}) => {
  const pagination = (cP, tP) => {
    const current = cP;
    const last = tP;
    const left = current - 1;
    const right = current + (current === 1 ? 3 : 2);
    const range = [];
    const overallRange = [];
    let pointer;

    for (let i = 1; i <= last; i += 1) {
      if (i === 1 || i === last || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i = 0; i < range.length; i += 1) {
      if (pointer) {
        if (range[i] - pointer === 2) {
          overallRange.push(pointer + 1);
        } else if (range[i] - pointer !== 1) {
          overallRange.push('...');
        }
      }
      overallRange.push(range[i]);
      pointer = range[i];
    }

    return overallRange;
  };

  const onPrevPage = () => {
    onPageChanged(currentPage - 1);
  };

  const onNextPage = () => {
    onPageChanged(currentPage + 1);
  };

  return (
    <PaginationWrapper>
      {currentPage > 1 && (
        <Button
          icon={<LeftArrowIcon />}
          onClick={() => onPrevPage()}
          mode="primary"
          noborder
          ariaLabel="Previous Page Button"
          className="action-button"
        />
      )}
      {pagination(currentPage, totalPages).map((item) => {
        if (!Number.isNaN(parseInt(item, 10))) {
          return (
            <Button
              key={item}
              onClick={() => onPageChanged(item)}
              mode="primary"
              noborder
              ariaLabel={`Page-${item} Button`}
              className={parseInt(item, 10) === currentPage ? 'active' : ''}
              disabled={parseInt(item, 10) === currentPage}
            >
              {item}
            </Button>
          );
        }
        return (<p className="dots">...</p>);
      })}
      {currentPage !== totalPages && totalPages > 1 && (
        <Button
          icon={<RightArrowIcon />}
          onClick={() => onNextPage()}
          mode="primary"
          noborder
          ariaLabel="Next Page Button"
          className="action-button"
        />
      )}
    </PaginationWrapper>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChanged: PropTypes.func,
};
