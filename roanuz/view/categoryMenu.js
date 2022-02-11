import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { ReactComponent as DownArrowIcon } from '@/roanuz/view/imgs/DownArrowLineIcon.svg';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { LoadingView } from './status';
import { asRem, Breakpoint } from '../lib/css';
import { SVGIcon } from './icon';
import { TextMedium16 } from '../typopgraphy';
import { categoryLink } from './category/model';

const LinkItemsWrapper = styled.ul`
  min-width: ${asRem(160)};
  @media screen and (min-width: ${Breakpoint.lg}) {
    margin-right:  ${asRem(40)};
  }
  li {
    a {
      display: block;
      padding-bottom: ${asRem(12)};
    }
    &.level-3 {
      >a {
        font-weight: bold;
      }
      &.has-children {
        ul {
          >li {
            a {
              padding-left: ${asRem(12)};
              border-left: 1px solid var(--color-disabled-3);
            }
            &:last-child {
              a {
                padding-bottom: 0;
              }
            }
          }
        }
      }
    }

    ul {
      padding-bottom: ${asRem(12)};
    }
  }
`;

export const BaseCategoryMenuViewWrapper = styled.div`
  position: relative;
  display: none;
  &.show-category-menu {
    display: block;
    .category-menu-container {
      height: auto;
      padding-top: ${asRem(25)};
      @media screen and (min-width: ${Breakpoint.md}) {
        padding-top: ${asRem(40)};
      }
    }
  }
  .category-menu-container {
    left: -100%;
    position: absolute;
    z-index: 102;
    display: flex;
    a { 
      color: var(--color-text);
    }
    .overflow-container {
      position: relative;
      &:before {
        content: '';
        display: block;
        width: 0;
        height: 0;
        position: absolute;
        top: -${asRem(12)};
        left: 50%;
        border-top: ${asRem(8)} solid transparent;
        border-bottom: ${asRem(8)} solid transparent;
        border-right: ${asRem(8)} solid #fff;
        transform: rotate(90deg);
      }
      ul {
        overflow-y: auto;
        max-height: calc(100vh - ${asRem(173)}); // Height of TL header + 20
      }
    }

    li {
      &.active {
        a {
          color: var(--color-button);
        }

        .rz-svg-icon {
          color: var(--color-button);
        }
      }
    }

    .level-parent {
      width: ${asRem(278)};
      background-color: #fff;
      border-radius: ${asRem(8)};
      padding: ${asRem(10)} 0;
      transition: all 0.35s ease-out;
      box-shadow: -8px 4px 12px rgba(17, 17, 17, 0.3);
      position: relative;
      &.has-child-level {
        border-top-right-radius: 0;
      }

      .rz-svg-icon {
        color: var(--color-disabled);
        svg {
          transform: rotate(-90deg);
        }
      }

      li {
        padding: ${asRem(10)} ${asRem(20)};

        &:hover {
          background: #7e7e7e12; 
        }

        a {
          display: flex;
          justify-content: space-between;

          >span {
            display: block;
            flex: 1;
          }
        }
      }
    }

    .level-n {
      z-index: 100;
      // max-height: ${asRem(540)};
      background-color: #fff;
      border-radius: ${asRem(8)};
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      padding: ${asRem(30)};
      box-shadow: 6px 4px 12px rgba(17, 17, 17, 0.35);
      border-left: ${asRem(1)} solid var(--color-border);

      font-weight: 500;
      font-size: ${asRem(14)};
      line-height: ${asRem(20)};
      /* column-count: 1; */
      /* column-fill: auto; */
      overflow-x: auto;
      max-height: calc(100vh - ${asRem(173)}); // Height of TL header + 20
      display: flex;
      &.moreThan-20>ul {
        column-count: 2;
        height: fit-content;
        li {
          -webkit-column-break-inside: avoid;
          page-break-inside: avoid;
          break-inside: avoid;
        }
      }
      &.moreThan-40>ul {
        @media screen and (min-width: ${Breakpoint.md}) {
          column-count: 3;
          height: fit-content;
          li {
            -webkit-column-break-inside: avoid;
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      }
    }

    &.sticky {
      .overflow-container {
        ul {
          max-height: calc(100vh - ${asRem(103)}); // Height of TL sticky header + 20
        }
      }
      .level-n {
        max-height: calc(100vh - ${asRem(103)}); // Height of TL sticky header + 20
      }
    }
  }

`;

export const LinkItems = ({ items }) => {
  if ((!items) || items.length === 0) {
    return null;
  }
  const itemsRef = [...items];
  const itemsSorted = itemsRef.sort((x, y) => x.position - y.position);
  const className = `level-${itemsSorted[0].level}`;
  const elements = itemsSorted.filter((x) => x.include_in_menu === 1).map((item) => (
    <li
      key={item.uid}
      className={
        `${className} ${(item.children && item.children.length > 0) ? 'has-children' : ''}`
      }
    >
      <>
        <Link href={categoryLink(item)} prefetch={false}>
          <a alt={`Link to ${item.name}`} className="plain">{item.name}</a>
        </Link>
        {item.children && (
          <LinkItems items={item.children} prefetch={false} />
        )}
      </>
    </li>
  ));

  return (
    <LinkItemsWrapper>
      {elements}
    </LinkItemsWrapper>
  );
};

LinkItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export const CategoryMenuView = ({
  tree,
  loading,
  show,
  isServiceLinks = false,
}) => {
  const [stickyHeader, setStickyHeader] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY <= 0) {
        setStickyHeader(false);
      } else {
        setStickyHeader(true);
      }
    });
  });

  const [activeParent, setActiveParent] = useState(5);

  useEffect(() => {
    const navBarContainerSelector = document.getElementById('level_n_container');
    if (navBarContainerSelector) {
      navBarContainerSelector.scrollTop = 0;
    }
  }, [activeParent]);
  if (!tree) return (<LoadingView />);
  let items = tree.categories.items
    .filter((x) => x.include_in_menu)
    .sort((x, y) => x.position - y.position);
  if (!isServiceLinks) {
    items = items.filter((x) => x.product_count > 0);
  }

  if (loading) return (<LoadingView />);

  let allChildrenLength = null;
  if (items[activeParent] && items[activeParent].children) {
    allChildrenLength = items[activeParent].children.length;
  }
  const fetchAllNestedChildrenLength = (obj) => {
    if (!obj.children) {
      return;
    }
    if (obj.children && obj.children.length) {
      allChildrenLength += obj.children.length;
      obj.children.forEach((child) => fetchAllNestedChildrenLength(child));
    }
  };
  if (items[activeParent] && items[activeParent].children) {
    items[activeParent].children.forEach((op) => {
      fetchAllNestedChildrenLength(op);
    });
  }

  return (
    <CategoryMenuViewWrapper className={show ? 'show-category-menu' : ''}>
      <div className={`category-menu-container ${stickyHeader ? 'sticky' : ''}`}>
        <div className="overflow-container">
          <ul
            className={`level-parent ${items[activeParent] && items[activeParent].children.length > 0 ? 'has-child-level' : ''}`}
          >
            {items.map((item, i) => (
              <li
                key={item.uid}
                onMouseOver={() => setActiveParent(i)}
                onFocus={() => 0}
                className={i === activeParent ? 'active' : ''}
              >
                <Link href={categoryLink(item)} prefetch={false}>
                  <a alt={`Link to ${item.name}`} className="plain">
                    <TextMedium16 as="span">{item.name}</TextMedium16>
                    {item.children.length > 0 && (
                      <SVGIcon heightPx={22}>
                        <DownArrowIcon />
                      </SVGIcon>
                    )}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {items[activeParent] && items[activeParent].children.length > 0 && (
          <div
            className={`level-n
              ${allChildrenLength > 20 ? 'moreThan-20' : ''}
              ${allChildrenLength > 40 ? 'moreThan-40' : ''}
            `}
            id="level_n_container"
          >
            <LinkItems items={items[activeParent].children} />
          </div>
        )}
      </div>
    </CategoryMenuViewWrapper>
  );
};

CategoryMenuView.propTypes = {
  tree: PropTypes.object,
  loading: PropTypes.bool,
  show: PropTypes.bool,
  isServiceLinks: PropTypes.bool,
};

export const CategoryMenuViewWrapper = withDependencySupport(BaseCategoryMenuViewWrapper, 'CategoryMenuViewWrapper');
