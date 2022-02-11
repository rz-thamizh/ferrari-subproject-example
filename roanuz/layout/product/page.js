import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseProductPageLayoutWrapper = styled.div`
  --space-between-sections: ${asRem(60)};

  .page-breadcrumb {
    margin-top: ${asRem(12)};
  }

  .page-notice {
    margin-top: ${asRem(30)};
  }
  .page-title {
    margin-top: ${asRem(30)};
    display: flex;
    justify-content: space-between;

    ${(p) => p.hasNotice && css`
      margin-top: ${asRem(15)};
    `}

    >.right-container {
      .rz-image-view {
        max-height: ${asRem(40)};
        width: ${asRem(100)};
        text-align: right;
        img {
          object-fit: scale-down;
          max-width: 100%;
          height: ${asRem(40)};
        }
      }
    }

    flex-direction: column;
    >.left-container {
      order: 2;
    }

    &.mobile-view {
      h1 {
        font-weight: normal;
        font-size: ${asRem(24)};
        line-height: ${asRem(32)};
      }
    }

    @media screen and (min-width: ${Breakpoint.sm}) {
      flex-direction: initial;
      >.right-container {
        margin-left: ${asRem(15)};
      }
      >.left-container {
        order: initial;
      }
    }
  }

  .page-section {
    @media screen and (min-width: ${Breakpoint.sm}) {
      margin-bottom: var(--space-between-sections);
    }
  }

  .page-product-section {
    display: flex;
    margin-top: ${asRem(30)};
    flex-direction: column;
    @media screen and (min-width: ${Breakpoint.sm}) {
      flex-direction: initial;
    }

    >div {
      @media screen and (min-width: ${Breakpoint.sm}) {
        margin-right: ${asRem(60)};
      }

      &:last-child {
        margin-right: 0;
      }
    }

    >.section-gallery {
      flex: 1;
    }

    >.desc-container {
      display: flex;
      flex-flow: column;

      @media screen and (min-width: ${Breakpoint.lg}) {
        flex-flow: initial;
        width: ${asRem(640)};
      }

      >div {
        margin-right: ${asRem(60)};
  
        &:last-child {
          margin-right: 0;
        }
      }
      >.section-desc {
        width: ${asRem(320)};
        margin-top: ${asRem(16)};
        margin-bottom: ${asRem(16)};
        @media screen and (min-width: ${Breakpoint.sm}) {
          margin-bottom: ${asRem(34)};
        }
        @media screen and (min-width: ${Breakpoint.lg}) {
          margin-top: 0;
          margin-bottom: 0;
        }
        >div {
          >div, >section {
            margin-bottom: ${asRem(34)};
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
  
      >.section-sidebar {
        width: ${asRem(320)};
        margin-top: ${asRem(20)};
        @media screen and (min-width: ${Breakpoint.sm}) {
          margin-top: 0;
        }

        @media screen and (min-width: ${Breakpoint.lg}) {
          width: ${asRem(260)};
        }
  
        >div {
          >div {
            margin: ${asRem(20)} 0;
            &:first-child {
              margin-top: 0;
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    } 

    .energy-label-btn {
      img {
        height: ${asRem(35)};
      }
    }
  }
  .page-related-section {
    padding-top: ${asRem(50)};
    @media screen and (min-width: ${Breakpoint.sm}) {
      padding-top: 0;
    }
  }
`;

export const BaseProductPageLayout = ({
  className,
  breadcrumb, notice,
  title, titleRight,
  gallery, desc, sidebar,
  details,
  relatedItems,
  widgets,
}) => {
  return (
    <BaseProductPageLayoutWrapper
      hasNotice={notice}
      className={className}
    >
      {breadcrumb && (
        <div className="page-breadcrumb">{breadcrumb}</div>
      )}
      {notice && (
        <div className="page-notice">{notice}</div>
      )}
      <div className="page-title hide-mobile">
        <div className="left-container">{title}</div>
        {titleRight && (
          <div className="right-container">{titleRight}</div>
        )}
      </div>
      <div className="page-section page-product-section">
        <div className="section-gallery">{gallery}</div>
        <div className="page-title mobile-view hide-desktop">
          <div className="left-container">{title}</div>
          {titleRight && (
            <div className="right-container">{titleRight}</div>
          )}
        </div>
        <div className="desc-container">
          <div className="section-desc">{desc}</div>
          <div className="section-sidebar">{sidebar}</div>
        </div>
      </div>
      {details && (
        <div className="page-section page-details-section">{details}</div>
      )}
      {relatedItems && (
        <div className="page-section page-related-section">{relatedItems}</div>
      )}
      {widgets && (
        <div className="page-section page-widgets-section">{widgets}</div>
      )}
    </BaseProductPageLayoutWrapper>
  );
};

BaseProductPageLayout.propTypes = {
  className: PropTypes.string,
  breadcrumb: PropTypes.element,
  notice: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.bool,
  ]),
  title: PropTypes.element.isRequired,
  titleRight: PropTypes.element,
  gallery: PropTypes.element.isRequired,
  desc: PropTypes.element.isRequired,
  sidebar: PropTypes.element.isRequired,
  details: PropTypes.element,
  relatedItems: PropTypes.element,
  widgets: PropTypes.element,
};

export const ProductPageLayoutWrapper = withDependencySupport(BaseProductPageLayoutWrapper, 'ProductPageLayoutWrapper');
export const ProductPageLayout = withDependencySupport(BaseProductPageLayout, 'ProductPageLayout');
