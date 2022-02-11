import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';

const CheckoutPageLayoutWrapper = styled.div`
  margin-bottom: ${asRem(60)};
  @media screen and (min-width: ${Breakpoint.sm}) {
    margin: ${asRem(45)} 0 ${asRem(60)} 0;
  }
  @media screen and (min-width: ${Breakpoint.lg}) {
    margin: ${asRem(60)} ${asRem(100)} ${asRem(100)} ${asRem(100)};
  }

  > .title-bar {
    padding-bottom: ${asRem(10)};
    border-bottom: 1px solid var(--color-grey-light);
    @media screen and (min-width: ${Breakpoint.sm}) {
      padding-bottom: ${asRem(15)};
    }
    >.links {
      padding-top: ${asRem(6)};
      display: flex;
      align-items: center;
      justify-content: space-between;

      >.right {
        text-align: right;
        p {
          white-space: nowrap;
        }
      }
      >.left {
        width: 100%;
        >ul {
          padding: ${asRem(8)} 0;
        }
      }
    }
  }

  > .content {
    --right-content-width: ${asRem(400)};
    padding-top: ${asRem(20)};

    @media screen and (min-width: ${Breakpoint.sm}) {
      display: flex;
      justify-content: space-between;
    }
    @media screen and (min-width: ${Breakpoint.md}) {
      --right-content-width: ${asRem(380)};
      padding-top: ${asRem(30)};
    }

    > .left {
      flex-grow: 1;
      @media screen and (min-width: ${Breakpoint.sm}) {
        padding-right: ${asRem(30)};
      }
      max-width: ${asRem(578)};
    }

    > .right {
      width: var(--right-content-width);
    }
  }

  > .widgets {
    padding-top: ${asRem(30)};
  }
`;

export const CheckoutPageLayout = ({
  className,
  title, titleLinksLeft, titleLinksRight,
  content,
  side,
  widgets,
  summaryBand,
}) => {
  return (
    <CheckoutPageLayoutWrapper className={className}>
      <section className="cart-summary-band hide-desktop">
        {summaryBand}
      </section>
      <section className="title-bar">
        {title}
        <div className="links">
          <div className="left">
            {titleLinksLeft}
          </div>
          {titleLinksRight && (
            <div className="right hide-mobile">{titleLinksRight}</div>
          )}
        </div>
      </section>
      <section className="content">
        <div className="left">
          {content}
        </div>
        {side && (
          <div className="right hide-mobile">
            {side}
          </div>
        )}
      </section>
      {widgets && (
        <section className="widgets">{widgets}</section>
      )}
    </CheckoutPageLayoutWrapper>
  );
};

CheckoutPageLayout.propTypes = {
  className: PropTypes.string,
  title: PropTypes.element.isRequired,
  titleLinksLeft: PropTypes.element.isRequired,
  titleLinksRight: PropTypes.element,
  content: PropTypes.element.isRequired,
  side: PropTypes.element,
  widgets: PropTypes.element,
  summaryBand: PropTypes.element,
};
