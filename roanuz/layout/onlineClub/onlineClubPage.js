import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';

const OnlineClubPageLayoutWrapper = styled.div`
  padding-top: ${asRem(40)};
  >.bottom-content {
    display: flex;
    justify-content: space-between;
    flex-direction: column;

    @media screen and (min-width: ${Breakpoint.sm}) {
      flex-direction: row;
      grid-gap: ${asRem(40)};
    }

    @media screen and (min-width: ${Breakpoint.md}) {
      grid-gap: ${asRem(100)};
    }


    >.rz-image-view {
      margin-top: ${asRem(32)};
      @media screen and (min-width: ${Breakpoint.sm}) {
        margin-top: 0;
        flex: 50% 1;
      }
      img {
        max-width: 100%;
      }
    }
  }
`;

export const OnlineClubPageLayout = ({
  topContent,
  form,
  image,
}) => {
  return (
    <OnlineClubPageLayoutWrapper>
      {topContent}
      <div className="bottom-content">
        {form}
        {image}
      </div>
    </OnlineClubPageLayoutWrapper>
  );
};

OnlineClubPageLayout.propTypes = {
  form: PropTypes.element.isRequired,
  image: PropTypes.element,
  topContent: PropTypes.element,
};
