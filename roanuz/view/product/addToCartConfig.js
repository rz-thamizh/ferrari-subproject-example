import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import {
  DisplayBold20, TextBold14,
} from '@/roanuz/typopgraphy';
import { DailogView } from '@/roanuz/view/dialog';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import OptionsView from '@/roanuz/options/OptionsView';
import { formatCurrency } from '../../lib/cart';
import { Button } from '../button';

const AddToCartConfigViewWrapper = styled.div`
  >.config-container {

    >.config-title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      button {
        display: block;
      }
    }

    >.config-action {
      border-top: 1px solid var(--color-disabled-3);
      padding-top: ${asRem(10)};
    }

    >.config-content {
      padding-top: ${asRem(15)};
      >section {
        padding-bottom: ${asRem(10)};
        >p {
          color: var(--color-disabled);
          text-transform: uppercase;
        }

        >ul{
          display: flex;
          flex-wrap: wrap;
          padding: ${asRem(10)} 0;
          li {
            padding-right: ${asRem(5)};
            padding-bottom: ${asRem(5)};
          }
        }
      }
    }
  }

  .left-align-input {
    label {
      justify-content: flex-end;
    }
  }

  .grouped-product {
    label {
      font-weight: 600;
    }
  }
`;

export const AddToCartConfigView = ({
  addToCart,
  product,
  cartOption,
  show,
  onOptionUpdate,
  onOptionCancel,
}) => {
  const formatCurrencyHandler = (item) => {
    const minPrice = item.price_range.minimum_price;
    return formatCurrency(minPrice.final_price.value, minPrice.final_price.currency);
  };
  const onValueUpdate = (config, item) => {
    onOptionUpdate('selected', { uid: config, value: item });
  };
  const onEnteredValueUpdate = (config, item) => {
    if (item && config) {
      onOptionUpdate('entered', { uid: config, value: item });
    }
  };

  return (
    <DailogView
      show={show}
      containerWidth="500px"
      titleText="Options"
      showClose
      onClose={onOptionCancel}
    >
      <AddToCartConfigViewWrapper>
        <div className="config-container">
          <div className="config-content">
            {product.configOptions && product.configOptions.map((config) => (
              <section
                key={config.uid}
              >
                <TextBold14>{config.label}</TextBold14>
                <ul>
                  {config.values.map((item) => (
                    <li key={item.uid}>
                      <Button
                        ariaLabel={item.label}
                        onClick={() => {
                          onOptionUpdate('selected', { uid: config.uid, value: item.uid });
                        }}
                        filled={cartOption && cartOption.selectedOptions[config.uid] === item.uid}
                      >
                        {item.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {product.groupedProducts && product.groupedProducts.map((item) => (
              <section
                key={item.product.uid}
                className="grouped-product"
              >
                <div>
                  <label>{item.product.name}</label>
                </div>
                <TextBold14>{formatCurrencyHandler(item.product)}</TextBold14>
                {/* Need to introduce quantity field here,
                once we do for throughtout app, we can include here meanwhile {item.qty} */}
              </section>
            ))}
            {product.bundledItemOptions && (
              <OptionsView
                options={product.bundledItemOptions}
                onChange={onValueUpdate}
                currency={product.minPrice.final_price.currency}
                cartOption={cartOption}
              />
            )}
            {product.options && (
              <OptionsView
                options={product.options}
                onChange={onEnteredValueUpdate}
                currency={product.minPrice.final_price.currency}
                cartOption={cartOption}
                isForCustomization
              />
            )}
          </div>
          {addToCart && (
            <div className="config-action">
              {addToCart}
            </div>
          )}
        </div>
      </AddToCartConfigViewWrapper>
    </DailogView>
  );
};

AddToCartConfigView.propTypes = {
  addToCart: PropTypes.element,
  product: PropTypes.object,
  cartOption: PropTypes.object,
  show: PropTypes.bool,
  onOptionUpdate: PropTypes.func,
  onOptionCancel: PropTypes.func,
};
