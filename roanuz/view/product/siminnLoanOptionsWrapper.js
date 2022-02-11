import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { SiminnLoanOptions } from '@/roanuz/view/product/siminnLoanOptions';
import { SiminnLoanOptionsV2 } from '@/roanuz/view/product/siminnLoanOptionsV2';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseSiminnLoanOptionsWrapperStyle = styled.div`
  --siminn-brand-color: #11BFEC;
  min-height: ${asRem(100)};
  .brand {
    >div {
      width: ${asRem(128)};
      img {
        max-width: 100%;
      }
    }
  }
  >.recommended {
    >.amount-section {
      display: flex;
      justify-content: space-between;
      padding: ${asRem(5)} 0;

      .rz-svg-icon {
        color: var(--siminn-brand-color);
      }
    }
  }

  .desc-section {
    color: var(--color-disabled);
    padding-top: ${asRem(2)};
    button {
      padding: 0;
      background: transparent;
      border: none;
      color: var(--color-button);
      font-weight: 500;
    }
  }
`;

export const BaseSiminnLoanOptionsWrapperStyle2 = styled(BaseSiminnLoanOptionsWrapperStyle)`
  min-height: auto;

  >.recommended {
    button {
      padding: 0;
      width: 100%;
      text-align: left;

      >span {
        width: 100%;
        display: flex;
        flex-direction: column-reverse;

        >.amount-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: ${asRem(5)};

          svg {
            padding: 0 0 0 ${asRem(5)};
            height: ${asRem(18)};

            path {
              stroke : var(--siminn-brand-color);
            }
          }
        }

        >.brand {
          >.rz-image-view {
            width: 100%;
            max-width: ${asRem(167)};
            max-height: ${asRem(24)};
          }
        }
      }
    }
  }
`;

export const BaseSiminnLoanOptionsWrapper = ({
  loading, options, product,
}) => {
  return (
    <BaseSiminnLoanOptionsWrapperStyle>
      <SiminnLoanOptions
        loading={loading}
        options={options}
        product={product}
      />
    </BaseSiminnLoanOptionsWrapperStyle>
  );
};

BaseSiminnLoanOptionsWrapper.propTypes = {
  loading: PropTypes.bool.isRequired,
  options: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
};

export const BaseSiminnLoanOptionsWrapper2 = ({
  loading, options, product,
}) => {
  return (
    <BaseSiminnLoanOptionsWrapperStyle2>
      <SiminnLoanOptionsV2
        loading={loading}
        options={options}
        product={product}
      />
    </BaseSiminnLoanOptionsWrapperStyle2>
  );
};

BaseSiminnLoanOptionsWrapper2.propTypes = {
  ...BaseSiminnLoanOptionsWrapper,
};

export const SiminnLoanOptionsWrapper = withDependencySupport(BaseSiminnLoanOptionsWrapper, 'SiminnLoanOptionsWrapper');
