import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyledCheckbox } from '@/roanuz/layout';
import CartOptionLabel from './CartOptionLabel';

const CartOptionCheckboxView = ({
  config, onChange, currency, cartOption, checkboxOptions, isForCustomization,
}) => {
  const [value, setValue] = useState([]);
  const onValueChange = (event) => {
    const selectedValue = event.target.value;
    const isSelected = event.target.checked;
    const newValue = value ? [...value] : [];
    const index = newValue.indexOf(selectedValue);
    if ((!isSelected) && index > -1) {
      newValue.splice(index, 1);
    } else if (isSelected && index === -1) {
      newValue.push(selectedValue);
    }
    setValue(newValue);
  };

  useEffect(() => {
    onChange(value);
  }, [value]);

  useEffect(() => {
    setValue(cartOption.selectedOptions[config.uid]);
  }, [cartOption.selectedOptions]);

  const isChecked = (valueItem) => {
    if (cartOption) {
      if (isForCustomization) {
        return cartOption
          && cartOption.enteredOptions[config.uid]
          && cartOption.enteredOptions[config.uid].indexOf(valueItem.toString()) > -1;
      }
      return cartOption
          && cartOption.selectedOptions[config.uid]
          && cartOption.selectedOptions[config.uid].indexOf(valueItem) > -1;
    }
    return false;
  };

  return (
    <StyledCheckbox>
      {checkboxOptions
      && checkboxOptions.slice().sort((x, y) => x.position - y.position).map((item) => (
        <div key={item.uid}>
          <label>
            <input
              key={item.uid}
              type="checkbox"
              value={isForCustomization ? item.option_type_id : item.uid}
              checked={isChecked(isForCustomization ? item.option_type_id : item.uid)}
              onChange={onValueChange}
            />
            <CartOptionLabel
              config={item}
              priceConfig={item}
              currency={currency}
            />
          </label>
        </div>
      ))}
    </StyledCheckbox>
  );
};

CartOptionCheckboxView.propTypes = {
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  currency: PropTypes.string.isRequired,
  cartOption: PropTypes.object.isRequired,
  checkboxOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  isForCustomization: PropTypes.bool,
};

export default CartOptionCheckboxView;
