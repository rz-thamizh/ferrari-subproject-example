import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseProductPageSidebarLayoutWrapper = styled.div`
  section {
    >strong {
      display: block;
      padding-bottom: ${asRem(12)};
    }
    .rz-magento-html {
      iframe {
        padding: ${asRem(20)} 0;
        max-width: 100%;
      }
    }
  }
`;

export const BaseProductPageSidebarLayout = ({
  price,
  loan,
  actions,
}) => {
  return (
    <ProductPageSidebarLayoutWrapper>
      {price}
      {loan}
      {actions}
    </ProductPageSidebarLayoutWrapper>
  );
};

BaseProductPageSidebarLayout.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  shortDesc: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  energyLabel: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  storesStatus: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  returnDays: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  delivery: PropTypes.element,
  price: PropTypes.element,
  loan: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  options: PropTypes.element,
  actions: PropTypes.element,
  // eslint-disable-next-line react/no-unused-prop-types
  hasCrossSellProducts: PropTypes.bool,
};

export const ProductPageSidebarLayoutWrapper = withDependencySupport(BaseProductPageSidebarLayoutWrapper, 'ProductPageSidebarLayoutWrapper');
export const ProductPageSidebarLayout = withDependencySupport(BaseProductPageSidebarLayout, 'ProductPageSidebarLayout');
