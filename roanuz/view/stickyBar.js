import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Row, Col } from '@/roanuz/layout';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { SVGIcon } from '@/roanuz/view/icon';
import { ReactComponent as DownArrowLineIcon } from '@/roanuz/view/imgs/DownArrowLineIcon.svg';
import { ReactComponent as MenuIcon } from '@/roanuz/view/imgs/Menu.svg';
import { ReactComponent as StoreIcon } from '@/roanuz/view/imgs/Store.svg';
import { Bold16 } from '@/roanuz/typopgraphy';
import { WishListIndicatorView } from '@/roanuz/view/wishListIndicator';
import { CategoryMenuView } from '@/roanuz/view/categoryMenu';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { ClientSideView } from '@/roanuz/clientSide';
import { UserContext } from '@/store/core/context';
import { RZServicesTree } from '@/rz/lib/servicesTree';
import { MobileNavBarView } from './mobileNavBar';
import { LogoView } from './brand';

export const MenuItemWrapper = styled(Row)`
  padding: 0 ${asRem(15)};
  cursor: pointer;
  & :hover {
    .arrow-svg {
      transform: translateX(30%) rotate(-180deg);
    }
  }
  & .arrow-svg {
    padding-left: ${asRem(6)}; 
    transform: translateY(15%);
    transition: all 0.3s ease-in-out;
  }
`;

export const BaseStickyBarContainer = styled.div`
  background-color: var(--color-sticky-bg);
  color: var(--color-text-rev);
  a {
    color: var(--color-text-rev);
  }
  .sticky-bar-container {
    height: 100%;
    padding-top: ${asRem(20)};
    transition: padding 0.3s ease-in-out;
    > .left-item {
      .logo {
        @media screen and (min-width: ${Breakpoint.md}) {
          margin-right: ${asRem(17)};
        }
        margin-right: ${asRem(5)};
        img {
          height: ${asRem(50)};
          transition: all 0.3s ease-in-out;
        }
      }
    }
  
    > .right-item {
      .wishlist-item, .cart-item, .store-item, .menu-item {
        padding: ${asRem(6)};
        margin-left: ${asRem(5)}; 
        border-radius: 50%;
        & :hover {
          background-color: var(--color-button-hover);
        }
      }
      .wishlist-item {
        .rz-icon-indicator {
          text-align: center;
        }
      }
      
      .store-item {
        padding: ${asRem(10)};
        
        .store-svg {
          width: ${asRem(22)};
          height: ${asRem(20)};
        }
      }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    }
  }
  .menu-triggerl-col {
    margin-right: ${asRem(17)};
    b {
      padding-left: ${asRem(20)};
    }
    svg {
      height: ${asRem(24)};
    }
  }
  .mobile-search-col {
    padding: ${asRem(20)};
    flex: 1;
  }
  @media screen and (min-width: ${Breakpoint.sm}) {
    .sticky-bar-container {
      padding-top: ${asRem(10)};
      padding-bottom: ${asRem(10)};
    }
  }
  @media screen and (min-width: ${Breakpoint.md}) {
    .sticky-bar-container {
      padding-top: ${asRem(15)};
      padding-bottom: ${asRem(15)};
      > .right-item {
        flex: 1;
        .searchview-outer {
          margin-left: auto;
        }
        .wishlist-item, .cart-item {
          padding: ${asRem(10)};
          margin-left: ${asRem(10)}; 
        }
        .wishlist-item {
          margin-left: ${asRem(20)};
        }
      }
      > .left-item {
        .logo {
          img {
            height: ${asRem(70)};
          }
        }
      }
    }
  }
`;

export const BaseStickyBarContainerStyle2 = styled(BaseStickyBarContainer)`
  .sticky-bar-container {
    @media screen and (min-width: ${Breakpoint.sm}) {
      padding-top: ${asRem(24)};
      padding-bottom: ${asRem(24)};
    }
    > .left-item {
      .logo {
        margin-left: 0;
        img {
          width: ${asRem(120)};
          @media screen and (min-width: ${Breakpoint.sm}) {
            width: ${asRem(110)};
          }
          @media screen and (min-width: ${Breakpoint.md}) {
            width: ${asRem(138)};
          }
        }
        @media screen and (min-width: ${Breakpoint.lg}) {
          margin-right: ${asRem(80)};
        }
        .rz-image-view {
          height: initial;
        }
        img {
          max-width: ${asRem(138)};
          max-height: 100%;
          height: auto;
          vertical-align: middle;
        }
      }
      .menu-triggerl-col {
        margin-top: ${asRem(10)};
      }
    }
    .menu-col {
      margin-top: ${asRem(8)};
    }

    > .right-item {
      /* .wishlist-item {
        margin: 0;
      } */
      .searchview-outer {
        @media screen and (min-width: ${Breakpoint.lg}) {
          margin-right: ${asRem(60)};
        }
      }
      .cart-item,
      .store-item,
      .wishlist-item,
      .menu-item {
        padding: ${asRem(8)};
        @media screen and (min-width: ${Breakpoint.md}) {
          padding: ${asRem(9)} ${asRem(10)};
        }
        margin: 0;
        margin-left: ${asRem(10)};
        svg, .store-svg {
          width: ${asRem(26)};
          height: ${asRem(26)};
        }
      }
      .first-menu-item {
        margin-left: 0;
        @media screen and (min-width: ${Breakpoint.md}) {
          margin-left: ${asRem(10)};
        }
        >a {
          display: block;
          padding-top: ${asRem(5)};
          padding-right: ${asRem(4)};
          padding-left:${asRem(4)};
        }
      }
    }
    .mobile-search-col {
      padding: ${asRem(20)};
      @media screen and (min-width: ${Breakpoint.sm}) {
        padding: ${asRem(20)};
      }
    }
  }

  // Resetting Search field - Begin
  .ais-SearchBox {
    @media screen and (min-width: ${Breakpoint.sm}) {
      width: ${asRem(400)};
    }
    @media screen and (min-width: ${Breakpoint.lg}) {
      width: ${asRem(600)};
    }
  }
  .result-container {
    border-radius: 0;
    @media screen and (min-width: ${Breakpoint.sm}) {
      width: ${asRem(500)};
    }
    @media screen and (min-width: ${Breakpoint.md}) {
      width: ${asRem(800)};
    }
  }
  .ais-SearchBox {
    @media screen and (min-width: ${Breakpoint.sm}) {
      max-width: fit-content;
    }
    @media screen and (min-width: ${Breakpoint.md}) {
      max-width: 100%;
    }
  }

  --search-bar-radius-size: ${asRem(0)};

  .ais-SearchBox-form {
    height: ${asRem(52)};
    &::before {
      display: none;
    }

    .ais-SearchBox-input, .ais-SearchBox-submit {
      border-radius: var(--search-bar-radius-size);
    }

    .ais-SearchBox-input {
      border: 0; 
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      font-size: ${asRem(20)};
      line-height: ${asRem(25)};
      padding-left: ${asRem(12)};
      margin-right: -${asRem(1)};
      ::placeholder {
        color: #B7B7B7;
        opacity: 1;
      }
      
      :-ms-input-placeholder {
        color: #B7B7B7;
      }
      
      ::-ms-input-placeholder {
        color: #B7B7B7;
      }
    }
    .ais-SearchBox-submit {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      display: inline;
      background-color: #fff;
      width: ${asRem(50)};
      padding: ${asRem(12)};
      svg {
        fill: var(--color-button);
        height: ${asRem(20)};
        width: ${asRem(20)};
      }
    }
    .ais-SearchBox-reset {
      right: ${asRem(64)};
    }
  }
  // Resetting Search field - End

`;

export const StickyBarContainer = withDependencySupport(BaseStickyBarContainer, 'StickyBarContainer');

const BaseMenuItem = ({
  children, onClick, href, showDropDown,
}) => {
  let item = (
    <Bold16>{children}</Bold16>
  );
  if (href) {
    item = (
      <Link href={href}>
        <a>{item}</a>
      </Link>
    );
  }

  const clickHandler = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <MenuItemWrapper
      className="menu-item"
      alignCenter
      onClick={clickHandler}
    >
      <Col>{item}</Col>
      {showDropDown && (
        <Col>
          <SVGIcon heightPx={17}>
            <DownArrowLineIcon className="arrow-svg" />
          </SVGIcon>
        </Col>
      )}
    </MenuItemWrapper>
  );
};

BaseMenuItem.propTypes = {
  // children: PropTypes.oneOfType([
  //   PropTypes.element,
  //   PropTypes.string,
  // ]).isRequired,
  children: PropTypes.any,
  onClick: PropTypes.func,
  href: PropTypes.string,
  showDropDown: PropTypes.bool,
};

export const MenuItem = withDependencySupport(BaseMenuItem, 'BaseMenuItem');

export const BaseHeaderLeftSideLinks = ({
  categoryTree,
  categoryTreeLoading,
}) => {
  const [categoryTreeVisible, setCategoryTreeVisible] = useState(false);
  const [categoryServicesVisible, setCategoryServicesVisible] = useState(false);

  const showCategoryTree = () => {
    setCategoryTreeVisible(true);
  };
  const hideCategoryTree = () => {
    setCategoryTreeVisible(false);
  };

  const showServicesCategoryTree = () => {
    setCategoryServicesVisible(true);
  };
  const hideServicesCategoryTree = () => {
    setCategoryServicesVisible(false);
  };
  return (
    <>
      <Col className="logo">
        <LogoView />
      </Col>
      <Col
        className="menu-col hide-mobile"
        onMouseOver={showCategoryTree}
        onMouseOut={hideCategoryTree}
        onFocus={showCategoryTree}
        onBlur={hideCategoryTree}
      >
        <MenuItem
          showDropDown
        >
          Vöruflokkar
          <div className="category-tree">
            <CategoryMenuView
              tree={categoryTree}
              loading={categoryTreeLoading}
              show={categoryTreeVisible}
            />
          </div>
        </MenuItem>
      </Col>
      <Col
        className="menu-col hide-mobile"
        onMouseOver={showServicesCategoryTree}
        onMouseOut={hideServicesCategoryTree}
        onFocus={showServicesCategoryTree}
        onBlur={hideServicesCategoryTree}
      >
        <MenuItem
          showDropDown
        >
          Þjónusta
          <div className="category-tree">
            <CategoryMenuView
              tree={RZServicesTree}
              show={categoryServicesVisible}
              isServiceLinks
            />
          </div>
        </MenuItem>
      </Col>
      <Col
        className="menu-col hide-mobile"
      >
        <MenuItem href="/opnunartimi">
          Opnunartími
        </MenuItem>
      </Col>
    </>
  );
};

BaseHeaderLeftSideLinks.propTypes = {
  categoryTree: PropTypes.object,
  categoryTreeLoading: PropTypes.bool,
};

export const HeaderLeftSideLinks = withDependencySupport(BaseHeaderLeftSideLinks, 'HeaderLeftSideLinks');

export const BaseHeaderRightSideItems = () => {
  return (
    <>
      <Col className="store-item hide-desktop">
        <Link href="/opnunartimi">
          <a>
            <StoreIcon className="store-svg" />
          </a>
        </Link>
      </Col>
    </>
  );
};

export const HeaderRightSideItems = withDependencySupport(BaseHeaderRightSideItems, 'HeaderRightSideItems');

export const BaseStickBarView = ({
  cart,
  CartMiniType,
  wishList,
  searchView,
  categoryTree,
  categoryTreeLoading,
  WishListMiniType,
}) => {
  const userContext = useContext(UserContext);
  const [cartMiniVisible, setCartMiniVisible] = useState(false);
  const [wishListMiniVisible, setWishListMiniVisible] = useState(false);
  const [mobileNavVisible, setMobileNavVisible] = useState(false);

  const router = useRouter();

  const showMobileNav = () => {
    setMobileNavVisible(true);
  };
  const hideMobileNav = () => {
    setMobileNavVisible(false);
  };

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? 'with' : 'without'
        } shallow routing`,
      );
      hideMobileNav();
    };

    router.events.on('routeChangeStart', handleRouteChange);
    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  });

  const showCartMini = () => {
    setCartMiniVisible(true);
  };
  const hideCartMini = () => {
    setCartMiniVisible(false);
  };

  const showWishListMini = () => {
    setWishListMiniVisible(true);
  };
  const hideWishListMini = () => {
    setWishListMiniVisible(false);
  };

  return (
    <StickyBarContainer>
      <MobileNavBarView
        categoryTree={categoryTree}
        categoryTreeLoading={categoryTreeLoading}
        show={mobileNavVisible}
        hideMobileNav={hideMobileNav}
        servicesTree={RZServicesTree}
      />
      <Row spaceBetween alignCenter className="sticky-bar-container rz-page-content">
        <Col className="left-item">
          <Row alignCenter>
            <Col className="menu-triggerl-col hide-desktop">
              <MenuIcon onClick={showMobileNav} />
            </Col>
            <HeaderLeftSideLinks
              categoryTree={categoryTree}
              categoryTreeLoading={categoryTreeLoading}
            />
          </Row>
        </Col>
        <Col className="right-item">
          <Row alignCenter>
            <Col className="hide-mobile searchview-outer">
              {searchView}
            </Col>
            <HeaderRightSideItems isStoreVisibleAlways={false} />
            <Col
              onMouseOver={showWishListMini}
              onMouseOut={hideWishListMini}
              onFocus={showWishListMini}
              onBlur={hideWishListMini}
              className="wishlist-item"
            >
              <ClientSideView
                loadingView={(
                  <Link href="/customer/account">
                    <a alt="Goto Login">
                      <WishListIndicatorView />
                    </a>
                  </Link>
                )}
              >
                {userContext.token
                  ? (
                    <>
                      <Link href="/customer/account/wishlist">
                        <a alt="Goto My Wishlist">
                          <WishListIndicatorView
                            loading={wishList.loading}
                            error={wishList.error}
                            item={wishList.item}
                          />
                        </a>
                      </Link>
                      <WishListMiniType show={wishListMiniVisible} />
                    </>
                  )
                  : (
                    <Link href="/customer/account">
                      <a alt="Goto Login">
                        <WishListIndicatorView />
                      </a>
                    </Link>
                  )}
              </ClientSideView>
            </Col>
            {CartMiniType
              ? (
                <>
                  <Col
                    onMouseOver={showCartMini}
                    onMouseOut={hideCartMini}
                    onFocus={showCartMini}
                    onBlur={hideCartMini}
                    className="cart-item"
                  >
                    <Link href="/cart/">
                      <a alt="Goto Cart">
                        {cart}
                      </a>
                    </Link>
                    <CartMiniType show={cartMiniVisible} />
                    {/* {cartMiniVisible && cartMini} */}
                  </Col>
                </>
              ) : (
                <></>
              )}
          </Row>
        </Col>
      </Row>
      <Row className="hide-desktop" alignCenter>
        <Col className="mobile-search-col">
          {searchView}
        </Col>
      </Row>
    </StickyBarContainer>
  );
};

BaseStickBarView.propTypes = {
  wishList: PropTypes.shape(WishListIndicatorView.propTypes),
  cart: PropTypes.element,
  CartMiniType: PropTypes.elementType,
  categoryTree: PropTypes.object,
  categoryTreeLoading: PropTypes.bool,
  searchView: PropTypes.element,
  WishListMiniType: PropTypes.elementType,
};

export const StickBarView = withDependencySupport(BaseStickBarView, 'StickBarView');
