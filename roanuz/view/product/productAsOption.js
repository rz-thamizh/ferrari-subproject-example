import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { StyledRadio } from '@/roanuz/layout';
import { formatCurrency } from '@/roanuz/lib/cart';
import { asRem } from '@/roanuz/lib/css';
import {
  Bold16,
} from '@/roanuz/typopgraphy';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseProductAsOptionViewWrapper = styled.div`
  padding-bottom: ${asRem(15)};

  strong {
    color: var(--color-button);
  }

  >.option-title {
    padding-bottom: ${asRem(12)};
    display: block;
    strong {
      display: block;
    }
  }

  >ul {
    li {
      padding-bottom: ${asRem(10)};
      font-size: ${asRem(14)};
      line-height: ${asRem(20)};

      label {
        display: flex;
        align-items: center;

        input, span {
          display: block;
        }

        strong {
          padding-left: ${asRem(10)};
          font-weight: bold;
        }
      }

    }
  }
`;

export const ProductAsOptionView = ({
  product,
  onChange,
}) => {
  const itemCount = product.crosssellProducts.length;
  const [selectedOption, setSelectedOption] = useState();
  useEffect(() => {
    setSelectedOption(null);
  }, [product.sku]);

  if ((!product.crossSellAsOption) || itemCount === 0) return null;

  const onSelect = (event) => {
    const { value } = event.target;
    setSelectedOption(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <ProductAsOptionViewWrapper className="product-as-options">
      <Bold16 className="option-title">
        Tryggðu vöruna þína með&nbsp;
        <strong>viðbótartryggingu</strong>
      </Bold16>
      <ul>
        <li>
          <label>
            <StyledRadio>
              <input
                type="radio"
                name="insurance"
                value={null}
                checked={!selectedOption}
                onChange={onSelect}
              />
            </StyledRadio>
            <span>Engin trygging</span>
          </label>
        </li>
        {product.crosssellProducts.map((item) => (
          <li
            key={item.sku}
          >
            <label>
              <StyledRadio>
                <input
                  type="radio"
                  name="insurance"
                  value={item.sku}
                  checked={selectedOption === item.sku}
                  onChange={onSelect}
                />
              </StyledRadio>
              <span>
                {item.name}
                &nbsp;
                <strong>
                  {
                    formatCurrency(
                      item.price_range.minimum_price.final_price.value,
                      item.price_range.minimum_price.final_price.currency,
                    )
                  }
                </strong>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </ProductAsOptionViewWrapper>
  );
};

ProductAsOptionView.propTypes = {
  product: PropTypes.object,
  onChange: PropTypes.func,
};

export const ProductAsOptionViewWrapper = withDependencySupport(BaseProductAsOptionViewWrapper, 'ProductAsOptionViewWrapper');
