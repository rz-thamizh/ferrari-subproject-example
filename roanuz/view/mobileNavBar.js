import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import { Row, Col } from '@/roanuz/layout';
import { asRem } from '@/roanuz/lib/css';
import { SVGIcon } from '@/roanuz/view/icon';
import { DisplayBold20, Text16 } from '@/roanuz/typopgraphy';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { ReactComponent as CallIcon } from '@/roanuz/view/imgs/CallIcon.svg';
import { ReactComponent as CardIcon } from '@/roanuz/view/imgs/CardIcon.svg';
// import { ReactComponent as GiftIcon } from '@/roanuz/view/imgs/GiftIcon.svg';
import { ReactComponent as UserIcon } from '@/roanuz/view/imgs/UserIcon.svg';
import { ReactComponent as HlLogo } from '@/rz/view/imgs/HlLogo.svg';
import { ReactComponent as KGLogo } from '@/rz/view/imgs/KGLogo.svg';
import { MobileMenuView } from '@/roanuz/view/mobileMenu';
import { UserConsumer, UserContext } from '@/store/core/context';
import { Button } from '@/roanuz/view/button';
import Config from '@/config';
import { StoreSpecificContent } from '@/store/core/storeUtils';
import { LogoView } from './brand';

const TlMobileNavBarWrapper = styled.div`
`;

export const MobileNavWrapper = styled.div`
  position: fixed;
  top: 0;
  left: ${asRem(-320)};
  width: 100%;
  max-width: ${asRem(320)};
  z-index: 999;
  padding: ${asRem(20)};
  background-color: var(--color-text-rev);
  filter: drop-shadow(0px 0px 12px rgba(51, 51, 51, 0.18));
  height: 100vh;
  overflow-y: auto;
  transition: all 0.3s ease-in-out;
  ${(p) => p.show && css`
    left: 0;
  `}
  .rz-row {
    flex-flow: column;
    color: var(--color-text);
  }
  .logo {
    img {
      height: ${asRem(50)};
      margin-bottom: ${asRem(28)};
    }
  }
  >div {
    margin-bottom: ${asRem(50)};
  }
`;

export const MobileNavBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 100vh;
  background-color: rgba(51, 51, 51, 0.48);
  z-index: 121;
  opacity: 0;
  ${(p) => p.show && css`
    opacity: 1;
    width: 100%;
  `}
`;

export const MobileNavHead = styled.div`
  display: block;
  margin-bottom: ${asRem(18)};
  a {
    color: var(--color-text) !important;
  }
`;

export const QuickLinkItemCss = css`
  display: flex;
  align-items: center;
  .rz-svg-icon {
    margin-right: ${asRem(6)};
    vertical-align: middle;
  }
`;

export const QuickLinksCss = css`
  padding: ${asRem(28)} 0 ${asRem(10)} 0;
  border-top: 1px solid var(--color-disabled-3);
  border-bottom: 1px solid var(--color-disabled-3);
  .rz-quick-link-item {
    margin-bottom: ${asRem(28)};
    font-weight: 500;
    &:last-child{
      margin-right: 0;
    }
    a {
      color: var(--color-text);
      font-family: var(--tg-bold-family);
      display: flex;
      align-items: center;
      .rz-svg-icon {
        margin-right: ${asRem(13)};
        vertical-align: middle;
      }
    }

    .rz-svg-icon {
      min-width: ${asRem(20)}; // Temporarily Added. Once Icons are ready from design team will remove this.
    }
  }

  .button-wrapper {
    margin-bottom: ${asRem(28)};
    button {
      margin-left: ${asRem(33)}; // Temporarily Added. Once Icons are ready from design team will remove this.
      padding: 0;
      color: var(--color-error)
    }
  }
`;

export const BrandsRow = styled(Row)`
  padding: ${asRem(28)} 0;
`;

export const LogoBorder = styled.div`
  display: flex;
  align-items: center;
  >.store-link {
    color: var(--color-text);
    &:first-child {
      margin-right: ${asRem(14)};
      padding-right: ${asRem(14)};
      border-right: 1px solid var(--color-disabled-3);
    }
  }
  .kunigund-container {
    margin-top: ${asRem(-5)};
  }
`;

export const LogoDescCol = styled(Col)`
  display: flex;
  align-items: center;

  .desc-part {
    margin-bottom: ${asRem(14)};
    font-weight: 400;
    strong {
      font-weight: 700;
      margin-right: ${asRem(3)};
    }
  }
`;

export const BrandsView = () => {
  return (
    <BrandsRow>
      {/* <LogoDescCol>
        <Text16 className="desc-part" as="span">
          <strong>3 verslanir</strong>
          Eitt pöntunarferli
        </Text16>
      </LogoDescCol> */}
      <Col>
        <LogoBorder>
          <Link href={Config.SitePaths.HT}>
            <a target="_blank" className="store-link">
              <SVGIcon fillOnHover heightPx={23}>
                <HlLogo />
              </SVGIcon>
            </a>
          </Link>
          <Link href={Config.SitePaths.KG}>
            <a target="_blank" className="kunigund-container store-link">
              <SVGIcon fillOnHover heightPx={18}>
                <KGLogo />
              </SVGIcon>
            </a>
          </Link>
        </LogoBorder>
      </Col>
    </BrandsRow>
  );
};

export const QuickLinkItem = ({ name, href, children }) => {
  let item = (
    <>
      <SVGIcon heightPx={20}>{children}</SVGIcon>
      <Text16 as="span">{name}</Text16>
    </>
  );

  if (href) {
    item = (
      <Link href={href} prefetch={false}>
        <a className="plain" alt={name}>
          {item}
        </a>
      </Link>
    );
  }

  return (
    <div
      className="rz-quick-link-item"
      css={QuickLinkItemCss}
    >
      {item}
    </div>
  );
};

QuickLinkItem.propTypes = {
  name: PropTypes.string.isRequired,
  href: PropTypes.string,
  children: PropTypes.element.isRequired,
};

export const QuickLinks = () => {
  const userContext = useContext(UserContext);
  const { telephoneNumber } = StoreSpecificContent;

  return (
    <Row css={QuickLinksCss}>
      <QuickLinkItem name={`Sími ${telephoneNumber}`} href={`tel:${telephoneNumber}`}>
        <CallIcon />
      </QuickLinkItem>
      <QuickLinkItem name="Netklúbbur" href="/netklubbur">
        <CardIcon />
      </QuickLinkItem>
      {/* <QuickLinkItem name="Gjafakort" href="/page/gjafakort">
        <GiftIcon />
      </QuickLinkItem> */}
      <QuickLinkItem
        name="Mínar síður"
        href="/customer/account/"
      >
        <UserIcon />
      </QuickLinkItem>
      <UserConsumer>
        {({ logoutUser }) => (
          <>
            {userContext.token && (
              <>
                <QuickLinkItem name="Mínar pantanir" href="/customer/account/" />
                <QuickLinkItem name="Óskalistinn minn" href="/customer/account/wishlist" />
                <QuickLinkItem name="Heimilisföng" href="/customer/account/address" />
                <QuickLinkItem name="Aðgangsupplýsingar" href="/customer/account/edit-account" />
                <QuickLinkItem name="Póstlistaskráningar" href="/customer/account/newsletter" />
                <div className="button-wrapper">
                  <Button
                    onClick={() => logoutUser()}
                    noborder
                  >
                    <Text16>
                      Útskrá
                    </Text16>
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </UserConsumer>
    </Row>
  );
};

export const BaseMobileNavBarView = ({
  categoryTree,
  categoryTreeLoading,
  show,
  hideMobileNav,
  servicesTree,
}) => {
  return (
    <TlMobileNavBarWrapper show={show}>
      <MobileNavBackdrop
        show={show}
        className="hide-desktop"
        onClick={hideMobileNav}
      />
      <MobileNavWrapper show={show} className="hide-desktop hide-print-navbar">
        <Row>
          <Col className="logo">
            <LogoView />
          </Col>
          <Col className="menu-triggerl-col">
            <div className="category-tree-outer">
              <MobileNavHead>
                <DisplayBold20 as="span">Vöruflokkar</DisplayBold20>
              </MobileNavHead>
              <div className="category-tree">
                <MobileMenuView
                  tree={categoryTree}
                  loading={categoryTreeLoading}
                  show={show}
                />
              </div>
            </div>
            <div className="category-tree-outer">
              <MobileNavHead>
                <DisplayBold20 as="span">Þjónusta</DisplayBold20>
              </MobileNavHead>
              <div className="category-tree">
                <MobileMenuView
                  tree={servicesTree}
                  show={show}
                  isServiceLinks
                />
              </div>
            </div>
            <MobileNavHead>
              <Link href="/opnunartimi">
                <a alt="Stores" className="plain">
                  <DisplayBold20 as="span">Opnunartími</DisplayBold20>
                </a>
              </Link>
            </MobileNavHead>
          </Col>
          <Col>
            <QuickLinks />
          </Col>
          <Col>
            <BrandsView />
          </Col>
        </Row>
      </MobileNavWrapper>
    </TlMobileNavBarWrapper>
  );
};

BaseMobileNavBarView.propTypes = {
  categoryTree: PropTypes.object,
  categoryTreeLoading: PropTypes.bool,
  show: PropTypes.bool,
  hideMobileNav: PropTypes.func,
  servicesTree: PropTypes.object,
};

export const MobileNavBarView = withDependencySupport(BaseMobileNavBarView, 'MobileNavBarView');
