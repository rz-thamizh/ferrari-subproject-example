import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../lib/cart';

export const priceLabelString = (config, currency) => {
  let { title } = config;
  if (config.price && config.price > 0) {
    const price = config.price_type === 'FIXED'
      ? `${currency} ${config.price}`
      : `${config.price}%`;

    title = `${title} + ${price}`;
  }

  return title;
};

const CartOptionLabel = ({ config, priceConfig, currency }) => {
  let formatCurrencyHandler = null;
  if (config.product) {
    const minPrice = config.product.price_range.minimum_price;
    formatCurrencyHandler = (
      <span>
        {' '}
        +
        {formatCurrency(minPrice.final_price.value, minPrice.final_price.currency)}
      </span>
    );
  }

  return (
    <span>
      {config.title || config.label}
      {formatCurrencyHandler}
      {priceConfig && priceConfig.price > 0 && (
        <span>
          &nbsp;+&nbsp;
          {
            priceConfig.price_type === 'FIXED'
              ? `${currency} ${priceConfig.price}`
              : `${priceConfig.price}%`
          }
        </span>
      )}
      {config.required && '*'}
    </span>
  );
};

CartOptionLabel.propTypes = {
  config: PropTypes.object.isRequired,
  priceConfig: PropTypes.shape({
    price_type: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }),
  currency: PropTypes.string.isRequired,
};

export default CartOptionLabel;
