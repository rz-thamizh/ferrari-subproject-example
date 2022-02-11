import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseProductPageDescLayoutWrapper = styled.div`
  section {
    >strong {
      display: block;
      padding-bottom: ${asRem(12)};
    }
  }
`;

export const BaseProductPageDescLayout = ({
  shortDesc,
  energyLabel,
  storesStatus,
  returnDays,
}) => {
  return (
    <ProductPageDescLayoutWrapper>
      {(shortDesc || energyLabel) && (
        <div>
          {shortDesc}
          {energyLabel}
        </div>
      )}
      {storesStatus}
      {returnDays}
    </ProductPageDescLayoutWrapper>
  );
};

BaseProductPageDescLayout.propTypes = {
  shortDesc: PropTypes.element,
  energyLabel: PropTypes.element,
  storesStatus: PropTypes.element,
  returnDays: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  delivery: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  price: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  loan: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  options: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  actions: PropTypes.element,
};

export const ProductPageDescLayoutWrapper = withDependencySupport(BaseProductPageDescLayoutWrapper, 'ProductPageDescLayoutWrapper');
export const ProductPageDescLayout = withDependencySupport(BaseProductPageDescLayout, 'ProductPageDescLayout');
