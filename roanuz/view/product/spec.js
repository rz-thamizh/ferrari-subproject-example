import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  DisplayMedium18, Text16, TextMedium16,
} from '@/roanuz/typopgraphy';

import { ProductSpecGroupLayout, ProductSpecLayout, ProductSpecLineLayout } from '@/roanuz/layout/product/spec';

const ProductSpecViewWrapper = styled.div`
`;

export const ProductSpecView = ({ groups }) => {
  return (
    <ProductSpecViewWrapper>
      <ProductSpecLayout>
        {groups.map((group) => (
          <ProductSpecGroupLayout
            key={group.attributeGroup}
            groupName={(
              <DisplayMedium18>{group.attributeGroup}</DisplayMedium18>
            )}
          >
            {group.attributes.map((attribute) => (
              <ProductSpecLineLayout
                key={attribute.attributeCode}
                label={(
                  <Text16>{attribute.attributeLabel}</Text16>
                )}
              >
                <TextMedium16>{attribute.attributeValue}</TextMedium16>
              </ProductSpecLineLayout>
            ))}
          </ProductSpecGroupLayout>
        ))}
      </ProductSpecLayout>
    </ProductSpecViewWrapper>
  );
};

ProductSpecView.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.shape({
    attributeGroup: PropTypes.string.isRequired,
    attributes: PropTypes.arrayOf(PropTypes.shape({
      attributeCode: PropTypes.string.isRequired,
      attributeLabel: PropTypes.string.isRequired,
      attributeValue: PropTypes.string.isRequired,
    })),
  })).isRequired,
};
