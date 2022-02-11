import React from 'react';
import OptionsData from '@/stories/sample-data/siminnLoanOptions.json';
import { SiminnLoanOptions } from './siminnLoanOptions';

export default {
  title: 'View / Product / Siminn Loan Options',
  component: SiminnLoanOptions,
};

const Template = (args) => (
  <div style={{ background: '#ffebeb', padding: '40px' }}>
    <div
      style={{
        maxWidth: '320px', margin: 'auto', background: 'white', padding: '40px',
      }}
    >
      <SiminnLoanOptions
        {...args}
      />
    </div>
  </div>
);

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
  options: {},
};

export const Options = Template.bind({});
Options.args = {
  loading: false,
  options: OptionsData.data.rzSiminnLoanOptions,
};
