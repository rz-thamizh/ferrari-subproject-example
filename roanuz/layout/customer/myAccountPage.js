import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from 'styled-components';
import { MyAccountController } from '@/roanuz/controller/customer/myAccount';
import { SideNavBarController } from '@/roanuz/controller/customer/sideNavBar';
import { Breakpoint } from '@/roanuz/lib/css';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';

const MyAccountPageLayoutWrapper = styled.div`
>.account-page-main-content {
  .bottom-container {
    display: flex;
    .side-nav-bar {
      display: none;
      @media screen and (min-width: ${Breakpoint.sm}) {
        display: flex;
      }
    }
    @media screen and (min-width: ${Breakpoint.sm}) {
      flex-direction: row;
    }
  }
}
`;

export const MyAccountPageLayout = ({
  title, pageTitle, children,
}) => {
  return (
    <MyAccountPageLayoutWrapper>
      <Head>
        <title>
          {title}
        </title>
        <meta name="description" content={title} />
      </Head>
      <div className="account-page-main-content">
        <MyAccountController pageTitle={pageTitle} />
        <FormWrapperStyle>
          <div className="bottom-container">
            <SideNavBarController />
            {children}
          </div>
        </FormWrapperStyle>
      </div>
    </MyAccountPageLayoutWrapper>
  );
};

MyAccountPageLayout.propTypes = {
  title: PropTypes.string,
  pageTitle: PropTypes.string,
  children: PropTypes.any,
};
