import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import CartOptionFieldView from './CartOptionFieldView';
import CartOptionTextareaView from './CartOptionTextareaView';
import CartOptionLabel from './CartOptionLabel';
import CartOptionRadioView from './CartOptionRadioView';
import CartOptionCheckboxView from './CartOptionCheckboxView';
import CartOptionDropdownView from './CartOptionDropdownView';

const OptionsViewWrapper = styled.div`
  padding: 0 ${asRem(16)};

  [class^="type"] {
    padding: ${asRem(8)} 0;
    cursor: pointer;
    >span {
      display: block;
      padding-bottom: ${asRem(10)};
      font-weight: 600;
    }
    .field-inner {
      // padding-bottom: ${asRem(10)};
      >div {
        padding-bottom: ${asRem(10)};
      }
    }
    input, span {
      vertical-align: middle;
    }
  }

  .type-checkbox, .type-radio {
    input {
      margin-left: 0;
      &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
    }
    .field-inner {
      label {
        display: flex;
        align-items: center;
      }
      input, span {
        vertical-align: initial;
      }
      .rz-custom-radio, .rz-custom-checkbox {
        >div  {
          padding-bottom: 10px;
        }
      }
    }
  }

  .is-text-box {
    border: ${asRem(1)} solid var(--color-disabled-3);
    border-radius: ${asRem(4)};
    display: flex;
    align-items: center;

    >.action {
      button {
        padding: 0;
      }
    }

    >.input {
      flex-grow: 1;
    }

    input {
      outline: none;
      outline-offset: 0px;
      box-shadow: none;
      border: none;
      width: 100%;
      &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
      }
    }

    label, input {
      font-weight: 500;
      font-size: ${asRem(16)};
      line-height: ${asRem(22)};
    }
    label {
      position: relative;
      transition: all 0.25s ease-out;

      >span {
        color: var(--color-grey);
        position: absolute;
        left: 2px;
      }
    }

    .show-with-value {
      padding: ${asRem(6)} ${asRem(16)};

      label {
        >span {
          position: static;
          display: block;
          font-size: ${asRem(12)};
          line-height: ${asRem(16)};
          letter-spacing: ${asRem(0.2)};
        }
      }
    }
    
    .focus-focus {
      border-color: var(--color-button);
    }
  }
`;

const OptionsView = ({
  options, onChange, currency, cartOption, isForCustomization,
}) => {
  const [selections, setSelections] = useState({});
  const onValueChange = (uid, value) => {
    setSelections((state) => {
      const updates = { ...state };
      updates[uid] = value;
      return updates;
    });
  };

  useEffect(() => {
    onChange(selections);
  }, [selections]);

  const buildView = (option) => {
    switch (option.type) {
      case 'CustomizableFieldOption':
        return (
          <div key={option.uid} className={`type-${option.type}`}>
            <CartOptionLabel
              config={option}
              priceConfig={option.fieldOption}
              currency={currency}
            />
            <div className="field-inner">
              <CartOptionFieldView
                config={option.fieldOption}
                currency={currency}
                onChange={(value) => onChange(option.uid, value)}
              />
            </div>
          </div>
        );
      case 'CustomizableAreaOption':
        return (
          <div key={option.uid} className={`type-${option.type}`}>
            <CartOptionLabel
              config={option}
              priceConfig={option.areaOption}
              currency={currency}
            />
            <div className="field-inner">
              <CartOptionTextareaView
                config={option.areaOption}
                currency={currency}
                onChange={(value) => onChange(option.uid, value)}
              />
            </div>
          </div>
        );
      case 'CustomizableRadioOption':
      case 'radio':
        return (
          <div key={option.uid} className="type-radio">
            <CartOptionLabel
              config={option}
              currency={currency}
            />
            <div className="field-inner">
              <CartOptionRadioView
                config={option}
                radioOptions={option.options || option.radionOption}
                currency={currency}
                onChange={(value) => onChange(option.uid, value)}
                cartOption={cartOption}
                isForCustomization={isForCustomization}
              />
            </div>
          </div>
        );
      case 'CustomizableCheckboxOption':
      case 'checkbox':
        return (
          <div key={option.uid} className="type-checkbox">
            <CartOptionLabel
              config={option}
              currency={currency}
            />
            <div className="field-inner">
              <CartOptionCheckboxView
                config={option}
                checkboxOptions={option.options || option.checkboxOption}
                currency={currency}
                onChange={(value) => onChange(option.uid, value)}
                cartOption={cartOption}
                isForCustomization={isForCustomization}
              />
            </div>
          </div>
        );
      case 'CustomizableDropDownOption':
      case 'drop-down':
      case 'select':
        return (
          <div key={option.uid} className={`type-${option.type}`}>
            <CartOptionLabel
              config={option}
              currency={currency}
            />
            <div className="field-inner">
              <CartOptionDropdownView
                config={option}
                dropdownOptions={option.options || option.dropdownOption}
                currency={currency}
                onChange={(value) => onChange(option.uid, value)}
                cartOption={cartOption}
                isForCustomization={isForCustomization}
              />
            </div>
          </div>
        );
      case 'CustomizableMultipleOption':
      case 'multi':
        return (
          /* Checkbox is better option here until we the UX is finalised. */
          <div key={option.uid} className="type-checkbox">
            <CartOptionLabel
              config={option}
              currency={currency}
            />
            <div className="field-inner">
              <CartOptionCheckboxView
                config={option}
                checkboxOptions={option.options || option.multipleOption}
                currency={currency}
                onChange={(value) => onChange(option.uid, value)}
                cartOption={cartOption}
                isForCustomization={isForCustomization}
              />
            </div>
          </div>
        );
      default:
        return (
          <div key={option.uid}>
            Unhandled&nbsp;
            {option.type}
          </div>
        );
    }
  };

  if (!options) return null;
  return (
    <OptionsViewWrapper>
      <div>
        {options.map((option) => buildView(option))}
      </div>
    </OptionsViewWrapper>
  );
};

OptionsView.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  currency: PropTypes.string.isRequired,
  cartOption: PropTypes.object,
  isForCustomization: PropTypes.bool,
};

export default OptionsView;
