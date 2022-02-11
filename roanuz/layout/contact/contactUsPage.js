import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { ImageView } from '@/roanuz/view/image';
import { StoreSpecificContent } from '@/store/core/storeUtils';
import Config from '@/config';

export const ContactUsPageLayoutWrapper = styled.div`
  > .content {
    padding-top: ${asRem(20)};
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    @media screen and (min-width: ${Breakpoint.md}) {
      padding-top: ${asRem(30)};
      flex-direction: row;
    }

    > .left {
      flex-grow: 1;
      @media screen and (min-width: ${Breakpoint.md}) {
        width: calc(100% - ${asRem(600)});
      }
      @media screen and (min-width: ${Breakpoint.lg}) {
        width: calc(100% - ${asRem(850)});
      }
    }

    > .right {
      @media screen and (min-width: ${Breakpoint.md}) {
        padding-left: ${asRem(50)};  
      }                       
      
      .rz-image-view {
        max-width: ${asRem(700)};
        padding-top: ${asRem(45)};
        img {
          max-width: 100%;
        }
      }
      .map-container {
        width: 100%;
        
        @media screen and (min-width: ${Breakpoint.md}) {
          width: ${asRem(550)};
        }
        @media screen and (min-width: ${Breakpoint.lg}) {
          width: ${asRem(800)};
        }
      }
    }
  }
`;

export const BaseContactUsPageLayout = ({
  content,
  socialLinks,
  map,
}) => {
  const showMap = ['att'];

  const { contactUsPageStoreImg } = StoreSpecificContent;

  return (
    <ContactUsPageLayoutWrapper>
      <section className="content">
        <div className="left">
          {content}
          {socialLinks}
        </div>
        <div className="right">
          {showMap.includes(Config.WebsiteKey) ? map : (
            <ImageView
              src={contactUsPageStoreImg}
              alt="Store image"
            />
          )}
        </div>
      </section>
    </ContactUsPageLayoutWrapper>
  );
};

BaseContactUsPageLayout.propTypes = {
  content: PropTypes.element.isRequired,
  socialLinks: PropTypes.element,
  map: PropTypes.element,
};

export const ContactUsPageLayout = withDependencySupport(BaseContactUsPageLayout, 'ContactUsPageLayout');
