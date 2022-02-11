import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { TextMedium14 } from '@/roanuz/typopgraphy';
import { ReactComponent as BreadCrumbArrowIcon } from '@/roanuz/view/imgs/BreadCrumbArrow.svg';
import { asRem } from '@/roanuz/lib/css';
import { SVGIcon } from './icon';
import { categoryLink } from './category/model';

const ItemViewWrapper = styled(TextMedium14)`
  color: var(--color-button);
  max-width: 24ch;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;

  ${(p) => p.isActive && css`
    color: var(--color-text);
  `};
`;

const ItemView = ({
  text, href, alt, isActive,
}) => {
  return (
    <Link href={href}>
      <ItemViewWrapper
        isActive={isActive}
        as="a"
        alt={alt || text}
        href={href}
      >
        {text}
      </ItemViewWrapper>
    </Link>
  );
};

ItemView.propTypes = {
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  alt: PropTypes.string,
  isActive: PropTypes.bool,
};

const BreadcrumbViewWrapper = styled.ul`
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  align-items: center;
  > li {
    display: flex;
    > span {
      display: block;
      color: var(--color-grey);
    }

    svg {
      color: var(--color-grey);
      padding: 0 ${asRem(7)};
    }

    & :last-child {
      > span, svg {
        display: none;
      }
    }
  }
`;

export const BreadcrumbView = ({ links }) => {
  return (
    <BreadcrumbViewWrapper>
      {links.map((link) => (
        <li key={link.text}>
          { !link.isActive
            ? <ItemView {...link} />
            : <TextMedium14 as="label">{link.text}</TextMedium14>}
          <TextMedium14 as="span">
            <SVGIcon heightPx={10}>
              <BreadCrumbArrowIcon />
            </SVGIcon>
          </TextMedium14>
        </li>
      ))}
    </BreadcrumbViewWrapper>
  );
};

BreadcrumbView.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape(ItemView.propTypes)),
};

export function homeLink() {
  return {
    text: 'Heim',
    href: '/',
  };
}

export function buildProductBreadcrumbLinks({
  product,
  includeHome = true,
  includeProduct = true,
}) {
  const links = [];

  if (includeHome) {
    links.push(homeLink());
  }

  if (product.category) {
    const urlSuffix = product.category.url_suffix;

    product.category.breadcrumbs.forEach((item) => {
      let categoryPath = item.category_url_path;
      if (!categoryPath.startsWith('/')) {
        categoryPath = `/${categoryPath}`;
      }
      links.push({
        text: item.category_name,
        href: `${categoryPath}${urlSuffix}`,
      });
    });
  }

  if (includeProduct) {
    links.push({
      text: product.name,
      href: product.productLink,
      isActive: true,
    });
  }

  return links;
}

export function buildCategoryBreadcrumbLinks({
  category,
  includeHome = true,
  includeCategory = true,
}) {
  const links = [];

  if (includeHome) {
    links.push(homeLink());
  }

  if (category) {
    const urlSuffix = category.url_suffix;

    if (category.breadcrumbs) {
      category.breadcrumbs.forEach((item) => {
        let categoryPath = item.category_url_path;
        if (!categoryPath.startsWith('/')) {
          categoryPath = `/${categoryPath}`;
        }
        links.push({
          text: item.category_name,
          href: `${categoryPath}${urlSuffix}`,
        });
      });
    }

    if (includeCategory && category.url_path) {
      let categoryPath = category.url_path;
      if (!categoryPath.startsWith('/')) {
        categoryPath = `/${categoryPath}`;
      }
      links.push({
        text: category.name,
        href: `${categoryPath}${urlSuffix}`,
        isActive: true,
      });
    }
  }

  return links;
}

export function buildCategoryTitle(category, separator) {
  let titleItems = [category.name];
  const breadcrumbs = category.breadcrumbs || [];
  const sep = ` ${separator || '|'} `;
  if (breadcrumbs) {
    const names = breadcrumbs.map((x) => x.category_name);
    titleItems = [...names, ...titleItems];
  }
  return titleItems.reverse().join(sep);
}

export function buildBrandBreadcrumbLinks({
  brandMeta,
  category = null,
  includeHome = true,
  includeBrand = true,
}) {
  const links = [];

  if (includeHome) {
    links.push(homeLink());
  }

  if (includeBrand) {
    links.push({
      text: brandMeta.name,
      href: brandMeta.link,
      isActive: !category,
    });
  }

  if (category) {
    links.push({
      text: category.name,
      href: categoryLink(category),
      isActive: true,
    });
  }

  return links;
}
