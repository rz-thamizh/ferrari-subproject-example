import React from 'react';
import { DailogView } from '@/roanuz/view/dialog';
import { SiminnStatusView } from './siminnStatus';

export default {
  title: 'View / Cart / Payment / Siminn',
  component: SiminnStatusView,
};

const Template = (args) => (
  <DailogView
    titleText="Siminn Pay"
    showClose
    onClose={() => {}}
    show
  >
    <SiminnStatusView
      {...args}
    />
  </DailogView>
);

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
  error: false,
  message: '',
};

export const LoadingWithMessage = Template.bind({});
LoadingWithMessage.args = {
  loading: true,
  error: false,
  message: 'Please accept from your phone',
};

export const UnknownError = Template.bind({});
UnknownError.args = {
  loading: false,
  error: true,
  message: '',
};

export const ErrorWithMessage = Template.bind({});
ErrorWithMessage.args = {
  loading: false,
  error: true,
  message: 'Please check your phone number',
};

export const Message = Template.bind({});
Message.args = {
  loading: false,
  error: false,
  message: 'Everything is Good',
};
