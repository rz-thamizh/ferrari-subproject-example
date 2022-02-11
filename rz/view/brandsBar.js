import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import { Row, Col } from '@/roanuz/layout';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { Bold, Small } from '@/roanuz/typopgraphy';
import { SVGIcon } from '@/roanuz/view/icon';
import Config from '@/config';
import { ReactComponent as CallIcon } from '@/roanuz/view/imgs/CallIcon.svg';
import { ReactComponent as CardIcon } from '@/roanuz/view/imgs/CardIcon.svg';
import { ReactComponent as UserIcon } from '@/roanuz/view/imgs/UserIcon.svg';
// import { ReactComponent as RightArrowIcon } from '@/roanuz/view/imgs/RightArrowIcon.svg';
import { ReactComponent as HlLogo } from '@/rz/view/imgs/HlLogo.svg';
import { ReactComponent as KGLogo } from '@/rz/view/imgs/KGLogo.svg';
import { StoreSpecificContent } from '@/store/core/storeUtils';

const QuickLinkItemCss = css`
  .right-svg-col {
    max-width: ${asRem(20)};
    max-height: ${asRem(20)};
    margin-right: ${asRem(6)};
  }
`;

const QuickLinkItem = ({ name, href, children }) => {
  let item = (
    <Row alignCenter>
      <Col className="right-svg-col">
        <SVGIcon heightPx={20}>{children}</SVGIcon>
      </Col>
      <Col>
        {name}
      </Col>
    </Row>
  );

  if (href) {
    item = (
      <Link href={href}>
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

const QuickLinksCss = css`
  .rz-quick-link-item {
    margin-right: ${asRem(16)};
    font-family: var(--tg-bold-family);
    font-weight: 500;
    font-size: 0;
    @media (min-width: ${Breakpoint.md}) {
      font-size: ${asRem(14)};
      line-height: ${asRem(20)};
    }
    &:last-child{
      margin-right: 0;
    }
  }
`;

export const QuickLinks = () => {
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
    </Row>
  );
};

export const LogoDescCol = styled(Col)`
display: flex;
align-items: center;
margin-right: ${asRem(10)};

.desc-part {
  text-align: right;
  margin-right: ${asRem(10)};
  ${Small}, ${Bold} {
    display: block;
  }
}
.icon-part {
  >.rz-svg-icon {
    vertical-align: inherit;
  }
}
`;

export const BrandsView = () => {
  return (
    <Row alignCenter>
      {/* <LogoDescCol>
        <div className="desc-part">
          <Bold small>3 verslanir</Bold>
          <Small>Eitt pöntunarferli</Small>
        </div>
        <div className="icon-part">
          <SVGIcon heightPx={11}>
            <RightArrowIcon />
          </SVGIcon>
        </div>
      </LogoDescCol> */}
      <Col className="ht-container">
        <Link href={Config.SitePaths.HT}>
          <a target="_blank">
            <SVGIcon fillOnHover heightPx={19}>
              <HlLogo />
            </SVGIcon>
          </a>
        </Link>
      </Col>
      <Col className="kunikund-container seperator">
        <Link href={Config.SitePaths.KG}>
          <a target="_blank">
            <SVGIcon fillOnHover heightPx={15}>
              <KGLogo />
            </SVGIcon>
          </a>
        </Link>
      </Col>
    </Row>
  );
};

export const BarRow = styled(Row).attrs({ className: 'rz-page-content' })`
  height: var(--size-brand-nav-height);
  // padding: var(--size-brand-nav-padding) var(--space-page-side-padding);
  // padding-left: calc(var(--space-page-side-padding) + 1rem);
  align-items: center;
  .rz-svg-icon {
    vertical-align: middle;
  }
  .seperator {
    border-left: 1px solid var(--color-disabled-3);
    padding: ${asRem(6)} ${asRem(10)};
    padding-right: 0;
    >div {
      vertical-align: baseline;
    }
  }

  .kunikund-container, .ht-container {
    a {
      color: var(--color-text);
    }
  }
  .kunikund-container {
    padding-left: ${asRem(11)};
    margin-top: ${asRem(-3)};
  }
  .ht-container {
    padding-right: ${asRem(11)};
  }
`;
export const RZBrandsBarView = () => {
  return (
    <BarRow spaceBetween>
      <Col>
        <BrandsView />
      </Col>
      <Col>
        <QuickLinks />
      </Col>
    </BarRow>
  );
};
