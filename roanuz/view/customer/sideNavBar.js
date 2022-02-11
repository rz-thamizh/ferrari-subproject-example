import React from 'react';
import PropTypes from 'prop-types';
import { Display20 } from '@/roanuz/typopgraphy';
import Link from 'next/link';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';

const SideNavBarViewWrapper = styled.div`
  .nav-item {
    list-style: none;
    border-bottom: solid 1px var(--color-disabled-3);
    padding: ${asRem(16)};
    cursor: pointer;
    overflow-wrap: break-word;

    & :last-child {
      border-bottom: none;
    }
  }
`;

export const SideNavBarView = ({ dashBoardLinks }) => {
  return (
    <SideNavBarViewWrapper>
      {dashBoardLinks.map((page) => (
        <Link href={`/customer/account/${page.slug}/`} key={page.slug}>
          <Display20
            as="li"
            className="nav-item"
            id={page.slug}
          >
            {page.title}
          </Display20>
        </Link>
      ))}
    </SideNavBarViewWrapper>
  );
};

SideNavBarView.propTypes = {
  dashBoardLinks: PropTypes.array,
};
