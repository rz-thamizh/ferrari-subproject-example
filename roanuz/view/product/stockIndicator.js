import React from 'react';
import PropTypes from 'prop-types';
import { asRem } from '@/roanuz/lib/css';
import styled, { css } from 'styled-components';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { CircleIcon } from '../icon';
import { TextMedium14 } from '../../typopgraphy';
import { AvailableStatus } from './models/stock';

export const ProductStockIndicatorItemViewWrapper = styled.li`
  padding-right: ${asRem(14)};
  display: flex;
  align-items: baseline;
  .rz-svg-icon {
    color: var(--color-active);
    padding-right: ${asRem(12)};
    position: relative;

    svg {
      position: absolute;
    }
  }

  &.inactive {
    color: var(--color-disabled-2);
    .rz-svg-icon {
      color: var(--color-disabled-2);
    }
  }

  &.yellow {
    .rz-svg-icon {
      color: var(--color-indicator);
    }
  }
`;

export const indicatorClass = (status) => {
  switch (status) {
    case AvailableStatus.YES:
      return 'active';
    case AvailableStatus.YELLOW:
      return 'yellow';
    default:
      return 'inactive';
  }
};

export const BaseProductStockIndicatorItemView = ({ status, name }) => {
  return (
    <ProductStockIndicatorItemViewWrapper className={indicatorClass(status)}>
      <CircleIcon heightPx={8} />
      <TextMedium14 as="span">
        {name}
      </TextMedium14>
    </ProductStockIndicatorItemViewWrapper>
  );
};

BaseProductStockIndicatorItemView.propTypes = {
  status: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export const ProductStockIndicatorItemView = withDependencySupport(BaseProductStockIndicatorItemView, 'ProductStockIndicatorItemView');

const ProductStockIndicatorViewWrapper = styled.ul`
  display: flex;
  ${(props) => props.asList && css`
    flex-direction: column;
    li {
      padding-bottom: ${asRem(10)};
    }
  `}
`;

export const ProductStockIndicatorView = ({ items, asList }) => {
  return (
    <ProductStockIndicatorViewWrapper asList={asList}>
      {items.map((item) => (
        <ProductStockIndicatorItemView
          key={item.name}
          status={item.status}
          name={item.name}
        />
      ))}
    </ProductStockIndicatorViewWrapper>
  );
};

ProductStockIndicatorView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(ProductStockIndicatorItemView.propTypes)),
  asList: PropTypes.bool,
};
