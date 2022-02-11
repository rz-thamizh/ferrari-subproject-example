import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';

const CartPageLayoutWrapper = styled.div`
  margin-bottom: ${asRem(60)};
  @media screen and (min-width: ${Breakpoint.sm}) {
    margin: ${asRem(45)} 0 ${asRem(60)} 0;
  }
  @media screen and (min-width: ${Breakpoint.lg}) {
    margin: ${asRem(60)} 0 ${asRem(100)} 0;
  }

  > .title-bar {
    padding-top: ${asRem(20)};
    padding-bottom: ${asRem(10)};
    border-bottom: 1px solid var(--color-grey-light);
    @media screen and (min-width: ${Breakpoint.sm}) {
      padding-top: 0;
      padding-bottom: ${asRem(20)};
    }
    >.links {
      padding-top: ${asRem(6)};
      display: flex;
      justify-content: space-between;
      align-items: center;

      >.right {
        text-align: right;
        p {
          white-space: nowrap;
        }
      }
      >.left {
        width: 100%;
      }
    }
  }

  > .content {
    --right-content-width: ${asRem(320)};
    padding-top: ${asRem(20)};
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    @media screen and (min-width: ${Breakpoint.sm}) {
      flex-direction: row;
    }
    @media screen and (min-width: ${Breakpoint.md}) {
      --right-content-width: ${asRem(380)};
      padding-top: ${asRem(30)};
    }

    > .left {
      flex-grow: 1;
      max-width: ${asRem(446)};
      @media screen and (min-width: ${Breakpoint.sm}) {
        padding-right: ${asRem(45)};
      }
      @media screen and (min-width: ${Breakpoint.md}) {
        padding-right: ${asRem(15)};
        max-width: ${asRem(578)};
      }
      @media screen and (min-width: ${Breakpoint.lg}) {
        max-width: ${asRem(800)};
      }
    }

    > .right {
      margin-top: ${asRem(30)};
      @media screen and (min-width: ${Breakpoint.sm}) {
        margin-top: 0;
        width: var(--right-content-width);
      }
    }
  }

  > .widgets {
    padding-top: ${asRem(30)};
  }

  >.cart-error {
    color: var(--color-focus);
  }
`;

export const CartPageLayout = ({
  className,
  title,
  titleLinksRight,
  content,
  side,
  error,
}) => {
  return (
    <CartPageLayoutWrapper className={className}>
      <section className="cart-error">
        <p>{error}</p>
      </section>
      <section className="title-bar">
        <div className="links">
          <div className="left">
            {title}
          </div>
          {titleLinksRight && (
            <div className="right">{titleLinksRight}</div>
          )}
        </div>
      </section>
      <section className="content">
        <div className="left">
          {content}
        </div>
        {side && (
          <div className="right">
            {side}
          </div>
        )}
      </section>
    </CartPageLayoutWrapper>
  );
};

CartPageLayout.propTypes = {
  className: PropTypes.string,
  title: PropTypes.element.isRequired,
  titleLinksRight: PropTypes.element,
  content: PropTypes.element.isRequired,
  side: PropTypes.element,
  error: PropTypes.element,
};
