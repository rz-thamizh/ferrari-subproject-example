import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import {
  DisplayBold18,
} from '@/roanuz/typopgraphy';
import Link from 'next/link';
import { SocialLinks } from './socialLinks';

const SiteLinksViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media screen and (min-width: ${Breakpoint.sm}) {
    flex-direction: row;
  }
  @media screen and (min-width: ${Breakpoint.md}) {
    padding-left: ${asRem(50)};
  }

  >div {
    display: flex;
    flex-direction: column;
    padding-right: ${asRem(60)};
    padding-bottom: ${asRem(20)};
    &:last-child {
      padding-bottom: 0;
    }
    @media screen and (min-width: ${Breakpoint.sm}) {
      padding-bottom: 0;
    }
    &:last-child {
      padding-right: ${asRem(10)};
    }
    h4, a {
      padding-bottom: ${asRem(10)};
    }
  }  
`;

export const SiteLinksView = ({ siteLinks }) => {
  const siteLinksRef = Object.keys(siteLinks);
  return (
    <SiteLinksViewWrapper>
      {siteLinksRef.map((column, jindex) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={jindex}>
          <DisplayBold18>{siteLinks[column].header}</DisplayBold18>
          {siteLinks[column].links.map((link, index) => (
            !link.socialLinksList ? (
              // eslint-disable-next-line react/no-array-index-key
              <Link href={`/${link.path}`} prefetch={false} key={index}>
                <a alt={`Link to ${link.title}`} className="plain">
                  {link.title}
                </a>
              </Link>
            ) : (
              // eslint-disable-next-line react/no-array-index-key
              <SocialLinks socialLinks={link.socialLinksList} key={index} />
            )
          ))}
        </div>
      ))}
    </SiteLinksViewWrapper>
  );
};

SiteLinksView.propTypes = {
  siteLinks: PropTypes.object,
};
