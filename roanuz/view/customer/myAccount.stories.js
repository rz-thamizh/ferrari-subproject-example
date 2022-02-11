import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MyAccountView } from './myAccount';

export default {
  title: 'My Account / Top Bar',
  component: MyAccountView,
};

const MyAccountViewWrapper = styled.div`
  border-bottom: solid 1px var(--color-disabled-3);
`;
const Template = ({ pageTitle }) => (
  <MyAccountViewWrapper>
    <MyAccountView pageTitle={pageTitle} />
  </MyAccountViewWrapper>
);

export const View = Template.bind({});
View.args = {
  pageTitle: 'My Orders',
};

Template.propTypes = {
  pageTitle: PropTypes.string,
};
