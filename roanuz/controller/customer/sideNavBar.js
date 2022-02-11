import React from 'react';
import styled from 'styled-components';
import { SideNavBarView } from '@/roanuz/view/customer/sideNavBar';
import { asRem, Breakpoint } from '@/roanuz/lib/css';

const SideNavBarControllerWrapper = styled.ul.attrs(() => ({
  className: 'side-nav-bar',
}))`
  width: auto;

  @media screen and (min-width: ${Breakpoint.sm}) {
    padding-left: ${asRem(20)};
    padding-right: ${asRem(16)};
    border-right: solid 1px var(--color-disabled-3);
  }
`;

const dashBoardLinks = [
  {
    title: 'Mínar pantanir',
    slug: '/',
  },
  {
    title: 'Óskalistinn minn',
    slug: 'wishlist',
  },
  {
    title: 'Heimilisföng',
    slug: 'address',
  },
  {
    title: 'Aðgangsupplýsingar',
    slug: 'edit-account',
  },
  {
    title: 'Póstlistaskráningar',
    slug: 'newsletter',
  },
];

export const SideNavBarController = () => {
  return (
    <SideNavBarControllerWrapper>
      <SideNavBarView dashBoardLinks={dashBoardLinks} />
    </SideNavBarControllerWrapper>
  );
};

SideNavBarController.propTypes = {
};
