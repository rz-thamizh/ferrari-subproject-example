import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseFooterLayoutWrapper = styled.div`
  >.footer-top-content {
    padding-bottom: ${asRem(20)};
    border-bottom: ${asRem(1)} solid var(--color-disabled-4);
    @media screen and (min-width: ${Breakpoint.sm}) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    @media screen and (min-width: ${Breakpoint.md}) {
      justify-content: start;
    }
    @media screen and (min-width: ${Breakpoint.lg}) {
      justify-content: space-between;
    }

    .store-list-section {
      max-width: 100%;
      flex: 0 0 100%;
      @media screen and (min-width: ${Breakpoint.md}) {
        max-width: 50%;
        flex: 0 0 50%;
      }
      @media screen and (min-width: ${Breakpoint.lg}) {
        max-width: initial;
        flex: initial;
      }
    }
  }
`;

export const FooterLayout = ({
  className,
  storesList,
  socialLinks,
  mailListSubscription,
  privacyLinks,
  storesInfo,
}) => {
  return (
    <FooterLayoutWrapper className={`rz-page-content ${className}`}>
      <div className="footer-top-content">
        {storesList && (
          <div className="store-list-section">{storesList}</div>
        )}
        {storesInfo && (
          <div className="store-info-section">{storesInfo}</div>
        )}
        {socialLinks && (
          <div className="site-links-section">{socialLinks}</div>
        )}
        {mailListSubscription && (
          <div className="mail-subscription-section">{mailListSubscription}</div>
        )}
      </div>
      {privacyLinks && (
        <div className="privacy-links-section">{privacyLinks}</div>
      )}
    </FooterLayoutWrapper>
  );
};

FooterLayout.propTypes = {
  className: PropTypes.string,
  storesList: PropTypes.element,
  socialLinks: PropTypes.element,
  mailListSubscription: PropTypes.element,
  privacyLinks: PropTypes.element,
  storesInfo: PropTypes.element,
};

export const FooterLayoutWrapper = withDependencySupport(BaseFooterLayoutWrapper, 'FooterLayoutWrapper');
