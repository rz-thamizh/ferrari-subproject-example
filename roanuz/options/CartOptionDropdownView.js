import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { priceLabelString } from './CartOptionLabel';
import { formatCurrency } from '../lib/cart';

const CartOptionDropdownView = ({
  config, onChange, cartOption, dropdownOptions, currency, isForCustomization,
}) => {
  const [value, setValue] = useState('');
  if (isForCustomization) {
    if (!cartOption.enteredOptions[config.uid] && config.required) {
      onChange(config.dropdownOption[0].option_type_id);
    }
  } else if (!cartOption.selectedOptions[config.uid] && config.required) {
    onChange(config.options[0].uid);
  }
  const onValueChange = (event) => {
    const changeValue = event.target.value;
    setValue(changeValue);
  };

  useEffect(() => {
    onChange(value);
  }, [value]);

  useEffect(() => {
    setValue(cartOption.selectedOptions[config.uid]);
  }, [cartOption.selectedOptions]);

  const formatCurrencyHandler = (item) => {
    const minPrice = item.price_range.minimum_price;
    return formatCurrency(minPrice.final_price.value, minPrice.final_price.currency);
  };

  return (
    <select
      value={value}
      onChange={onValueChange}
    >
      {!config.required && (<option value="">---Select---</option>)}
      {dropdownOptions
      && dropdownOptions.slice().sort((x, y) => x.position - y.position).map((item) => (
        <option
          key={item.uid}
          value={isForCustomization ? item.option_type_id : item.uid}
        >
          {item.label || item.title}
          {item.product
          && ` +${
            formatCurrencyHandler(item.product)}`}
          {item && item.price > 0 && (
            priceLabelString(item, currency)
          )}
        </option>
      ))}
    </select>
  );
};

CartOptionDropdownView.propTypes = {
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  cartOption: PropTypes.object.isRequired,
  dropdownOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  currency: PropTypes.string.isRequired,
  isForCustomization: PropTypes.bool,
};

export default CartOptionDropdownView;
