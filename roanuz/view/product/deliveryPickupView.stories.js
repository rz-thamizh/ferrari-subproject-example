import React from 'react';
import { DeliveryPickupView } from './deliveryPickupView';

export default {
  title: 'View / Product / Delivery Pickup Info',
  component: DeliveryPickupView,
};

const Template = (args) => (
  <DeliveryPickupView {...args} />
);

export const DeliveryPickupTimes = Template.bind({});
DeliveryPickupTimes.args = {
  deliveryPickupTimes: {
    __typename: 'DeliveryPickupAssemblyTimesResponse',
    delivery_time: {
      __typename: 'DaysFromAndTo',
      min: 1,
      max: 2,
    },
    pickup_time: {
      __typename: 'DaysFromAndTo',
      min: 0,
      max: 0,
    },
    rz_assembly_days: 1,
  },
};
