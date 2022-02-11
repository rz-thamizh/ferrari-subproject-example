import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyledRadio } from '@/roanuz/layout';
import CartOptionLabel from './CartOptionLabel';

const CartOptionRadioView = ({
  config, onChange, currency, cartOption, radioOptions, isForCustomization,
}) => {
  const [value, setValue] = useState('');
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

  const isRadioSelected = (valueItem) => {
    if (cartOption) {
      if (isForCustomization) {
        return cartOption
          && cartOption.enteredOptions[config.uid]
          && cartOption.enteredOptions[config.uid].indexOf(valueItem) > -1;
      }
      return cartOption
          && cartOption.selectedOptions[config.uid]
          && cartOption.selectedOptions[config.uid].indexOf(valueItem) > -1;
    }
    return false;
  };

  return (
    <StyledRadio>
      {!config.required && (
        <div>
          <label>
            <input
              type="radio"
              value=""
              checked={!value}
              onChange={onValueChange}
            />
            <span>None</span>
          </label>
        </div>
      )}
      {radioOptions
      && radioOptions.slice().sort((x, y) => x.position - y.position).map((item) => (
        <div key={item.uid}>
          <label>
            {radioOptions.length > 1 && (
              <input
                key={item.uid}
                type="radio"
                value={isForCustomization ? item.option_type_id : item.uid}
                checked={isRadioSelected(isForCustomization ? item.option_type_id : item.uid)}
                onChange={onValueChange}
              />
            )}
            <CartOptionLabel
              config={item}
              priceConfig={item}
              currency={currency}
            />
          </label>
        </div>
      ))}
    </StyledRadio>
  );
};

CartOptionRadioView.propTypes = {
  config: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  currency: PropTypes.string.isRequired,
  cartOption: PropTypes.object.isRequired,
  radioOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  isForCustomization: PropTypes.bool,
};

export default CartOptionRadioView;
