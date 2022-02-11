import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { ReactComponent as DownArrowIcon } from '@/roanuz/view/imgs/DownArrowLineIcon.svg';
import { LoadingView } from './status';
import { asRem } from '../lib/css';
import { SVGIcon } from './icon';
import { DisplayMedium18 } from '../typopgraphy';

function categoryLink(category) {
  let path = category.url_path;
  if (path && !path.startsWith('/')) {
    path = `/${path}`;
  }
  return `${path}${category.url_suffix}`;
}

const LinkItemsWrapper = styled.ul`
  min-width: ${asRem(160)};
  li {
    a {
      display: block;
      padding-bottom: ${asRem(12)};
    }

    ul {
      padding-bottom: ${asRem(12)};
    }
  }
`;

const MobileMenuViewWrapper = styled.div`
  position: relative;
  >.category-menu-container {
    transition: all 0.4s ease-out;
    height: auto;
    overflow: hidden;
    display: flex;
    a { 
      color: var(--color-text);
    }

    li {
      &.active {
        a {
          color: var(--color-button);
        }

        .rz-svg-icon {
          color: var(--color-button);
          svg {
            transform: rotate(180deg);
          }
        }
      }
    }

    .level-parent {
      width: 100%;
      padding: ${asRem(10)} 0;
      transition: all 0.35s ease-out;

      .rz-svg-icon {
        color: var(--color-disabled);
      }

      > li {
        padding: 0;
        margin-bottom: ${asRem(18)};
        &.active {
          border-bottom: 1px solid var(--color-disabled-3);
        }

        a {
          >span {
            font-size: ${asRem(18)};
            line-height: ${asRem(24)};
          }
        }
      }
    }

    .level-n {
      padding-top: ${asRem(10)};
      padding-bottom: ${asRem(10)};
      font-weight: 500;
      font-size: ${asRem(14)};
      line-height: ${asRem(20)};
      li {
        &.has-children {
          > a {
            font-weight: 700;
          }
        }
        a {
          color: var(--color-text);
        }
      }
    }
  }

`;

const MobileMenuItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${asRem(8)};
  cursor: pointer;
  font-weight: 500;
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
          <LinkItems items={item.children} />
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

export const MobileMenuView = ({
  tree,
  loading,
  isServiceLinks = false,
  onActiveParentOpen,
}) => {
  const [activeParent, setActiveParent] = useState(false);

  const changeActiveMenu = (e, i) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (activeParent !== i) {
      setActiveParent(i);
    } else {
      setActiveParent(false);
    }
  };

  useEffect(() => {
    if (onActiveParentOpen) {
      onActiveParentOpen();
    }
  }, [activeParent, onActiveParentOpen]);

  if (!tree) return (<LoadingView />);
  let items = tree.categories.items
    .filter((x) => x.include_in_menu)
    .sort((x, y) => x.position - y.position);
  if (!isServiceLinks) {
    items = items.filter((x) => x.product_count > 0);
  }

  if (loading) return (<LoadingView />);

  return (
    <MobileMenuViewWrapper>
      <div className="category-menu-container">
        <ul className="level-parent">
          {items.map((item, i) => (
            <li
              key={item.uid}
              className={(i !== false) && (i === activeParent) ? 'active' : ''}
            >
              <MobileMenuItem
                onClick={(e) => changeActiveMenu(e, i)}
                onFocus={() => 0}
              >
                {item.children.length > 0 ? (
                  <>
                    <DisplayMedium18 as="span">{item.name}</DisplayMedium18>
                    <SVGIcon
                      heightPx={22}
                    >
                      <DownArrowIcon />
                    </SVGIcon>
                  </>
                ) : (
                  <Link href={categoryLink(item)} prefetch={false}>
                    <a alt={`Link to ${item.name}`} className="plain">
                      <DisplayMedium18 as="span">{item.name}</DisplayMedium18>
                    </a>
                  </Link>
                )}
              </MobileMenuItem>
              <div>
                {activeParent === i && items[activeParent]
                  && items[activeParent].children.length > 0 && (
                  <div className="level-n">
                    <LinkItems items={items[activeParent].children} />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MobileMenuViewWrapper>
  );
};

MobileMenuView.propTypes = {
  tree: PropTypes.object,
  loading: PropTypes.bool,
  isServiceLinks: PropTypes.bool,
  onActiveParentOpen: PropTypes.func,
};
