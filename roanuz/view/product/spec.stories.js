import React from 'react';
import { ProductSpecView } from './spec';

export default {
  title: 'View / Product / Spec',
  component: ProductSpecView,
  argTypes: { onClick: { action: 'clicked' } },
};
const Template = (args) => (
  <ProductSpecView {...args} />
);

export const Spec = Template.bind({});
Spec.args = {
  groups: [
    {
      attributeGroup: 'Geymsla',
      attributes: [
        {
          attributeCode: 'geymsla_gerd',
          attributeLabel: 'Gerð',
          attributeValue: 'PCIe NVMe SSD',
        },
      ],
    },
    {
      attributeGroup: 'Stærðir',
      attributes: [
        {
          attributeCode: 'sta_tyngd',
          attributeLabel: 'Þyngd',
          attributeValue: '2.5 kg',
        },
        {
          attributeCode: 'sta_litur',
          attributeLabel: 'Litur',
          attributeValue: 'Abyssal Black',
        },
      ],
    },
  ],
};
