import React from 'react';
import PropTypes from 'prop-types';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { ProductPageDetailView } from './productDetail';

export const BaseProductPageDetailViewGroup = ({
  product,
  specificationsList,
}) => {
  return (
    <ProductPageDetailView
      product={product}
      specificationsList={specificationsList}
      closedGroupsList={[
        'spec', 'energy',
      ]}
      alsoCloseAble="desc"
    />
  );
};

BaseProductPageDetailViewGroup.propTypes = {
  product: PropTypes.object,
  specificationsList: PropTypes.array,
};

export const ProductPageDetailViewGroup = withDependencySupport(BaseProductPageDetailViewGroup, 'ProductPageDetailViewGroup');
