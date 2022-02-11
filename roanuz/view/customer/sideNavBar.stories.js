import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { SideNavBarView } from './sideNavBar';

export default {
  title: 'My Account / sideBar',
  component: SideNavBarView,
};
const SideNavBarViewWrapper = styled.div`
  width: 30%;
  border-right: 1px solid var(--color-disabled-3);
`;

const Template = ({ dashBoardLinks }) => (
  <SideNavBarViewWrapper>
    <SideNavBarView dashBoardLinks={dashBoardLinks} />
  </SideNavBarViewWrapper>
);

export const View = Template.bind({});
View.args = {
  dashBoardLinks: [
    {
      title: 'My orders',
      slug: '/',
    },
    {
      title: 'My wish list',
      slug: 'wishlist',
    },
    {
      title: 'Addresses',
      slug: 'addresses',
    },
    {
      title: 'Access information',
      slug: 'edit-account',
    },
    {
      title: 'Mailing list Registration',
      slug: 'newsletter',
    },
  ],
};

Template.propTypes = {
  dashBoardLinks: PropTypes.arrayOf(PropTypes.object),
};
