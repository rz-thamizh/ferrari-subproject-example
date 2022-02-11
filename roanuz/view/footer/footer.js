import React from 'react';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { FooterLayout } from '@/roanuz/layout/footer';
import { FooterNewsLetterSubscription } from './footerNewsLetterSubscription';
import { StoresListView } from './storeList';
import { SiteLinksView } from './siteLinks';
import { PrivacyLinksView } from './privacyLinks';
import { storesList } from './footer.data';

export const siteLinks = {
  column1: {
    header: 'Þjónusta',
    links: [
      {
        path: 'greioslumatar',
        title: 'Greiðslumátar',
      },
      {
        path: 'afhendingarmatar',
        title: 'Afhendingarmátar',
      },
      {
        path: 'verkstaedi',
        title: 'Verkstæði',
      },
      {
        path: 'fyrirtaekjapjonusta',
        title: 'Fyrirtækjaþjónusta',
      },
      {
        path: 'abyrg',
        title: 'Ábyrgð',
      },
      {
        path: 'vi-botartrygging',
        title: 'Viðbótartrygging',
      },
      {
        path: 'skilarettur',
        title: 'Skilaréttur',
      },
    ],
  },
  column2: {
    header: 'Um Tölvulistann',
    links: [
      {
        path: 'um-tolvulistann',
        title: 'Um okkur',
      },
      {
        path: 'atvinna',
        title: 'Atvinna',
      },
      {
        path: 'netklubbur',
        title: 'Netklúbbur',
      },
      {
        path: 'contact',
        title: 'Hafðu samband',
      },
    ],
  },
};

export const BaseSiteLinks = () => {
  return (
    <SiteLinksView siteLinks={siteLinks} />
  );
};

export const BaseStoresList = () => {
  return (
    <StoresListView stores={storesList} />
  );
};

export const BaseNewsLetterSubscription = () => {
  return (
    <FooterNewsLetterSubscription
      roundedCorners
    />
  );
};

export const FooterViewWrapper = styled.div`
  font-size: ${asRem(16)};
  line-height: ${asRem(20)};
`;

export const BaseFooterView = () => {
  return (
    <FooterViewWrapper>
      <FooterLayout
        storesList={(<StoresList />)}
        socialLinks={(<SiteLinks />)}
        mailListSubscription={(<NewsLetterSubscription />)}
        privacyLinks={(<PrivacyLinksView />)}
      />
    </FooterViewWrapper>
  );
};

BaseFooterView.propTypes = {};
BaseSiteLinks.propTypes = {};
BaseNewsLetterSubscription.propTypes = {};
BaseStoresList.propTypes = {};
export const FooterView = withDependencySupport(BaseFooterView, 'FooterView');
export const SiteLinks = withDependencySupport(BaseSiteLinks, 'SiteLinks');
export const NewsLetterSubscription = withDependencySupport(BaseNewsLetterSubscription, 'NewsLetterSubscription');
export const StoresList = withDependencySupport(BaseStoresList, 'StoresList');
