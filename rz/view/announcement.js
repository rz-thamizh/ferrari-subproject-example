import React from 'react';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { announcementData } from '@/roanuz/view/footer/footer.data';

const RZAnnouncementBarWrapper = styled.div`
  display: none;
  font-size: ${asRem(16)};
  line-height: ${asRem(20)};
  box-shadow: 0px 0px 8px rgba(51, 51, 51, 0.14), 0px 0px 16px rgba(51, 51, 51, 0.12);
  
  .announcement-section {
    padding: ${asRem(5)} var(--space-page-side-padding);
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: ${asRem(30)};
    }

    p {
      padding-left: ${asRem(6)};
      max-width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 1;
      white-space: nowrap;
    }
  }
`;

export const RZAnnouncementBar = () => {
  return (
    <RZAnnouncementBarWrapper>
      <div className="announcement-section">
        <img src={announcementData.img} alt="Announcement Logo" />
        <p>{announcementData.text}</p>
      </div>
    </RZAnnouncementBarWrapper>
  );
};
