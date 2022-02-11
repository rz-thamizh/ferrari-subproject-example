import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import Link from 'next/link';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { createBrandLink } from './model';

export const BaseBrandCategoriesViewWrapper = styled.div`
  ul {
    display: flex;
    flex-wrap: wrap;

    li {
      display: block;
      margin-right: ${asRem(14)};
      margin-bottom: ${asRem(12)};

      &:last-child: {
        margin-right: 0;
      }

      a {
        display: block;
        padding: ${asRem(14)} ${asRem(30)};
        border-radius: ${asRem(30)};
        color: var(--color-button);
        border: 1px solid var(--color-button);
        transition: all 0.5s ease-out;

        &:hover {
          background-color: var(--color-button);
          color: var(--color-text-rev);
          text-decoration: none;
        }
      }

      &.filled {
        --fill-color: #8983E4;

        &.color-1 { --fill-color: #3C73D6; }
        &.color-2 { --fill-color: #43ABDA; }
        &.color-3 { --fill-color: #E48983; }
        &.color-4 { --fill-color: #CA5DA8; }
        &.color-5 { --fill-color: #3C73D6; }

        a {
          color: var(--color-text-rev);
          background-color: var(--fill-color);
          border-color: var(--fill-color);

          &:hover {
            color: var(--fill-color);
            background-color: var(--color-text-rev);
          }
        }
      }
    }
  }
`;

export const BrandCategoriesView = ({
  brandUrlKey,
  showCount,
  filledStyle,
  categories,
}) => {
  const colorsCount = 6;
  const liClassName = filledStyle ? 'filled' : '';
  return (
    <BrandCategoriesViewWrapper>
      <ul>
        {categories.map((category, i) => (
          <li
            key={category.id}
            className={`${liClassName} color-${i % colorsCount}`}
          >
            <Link href={createBrandLink(brandUrlKey, category.id)}>
              <a alt={`Link to ${category.name}`}>
                {category.name}
                {showCount && (
                  <span>{` (${category.count})`}</span>
                )}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </BrandCategoriesViewWrapper>
  );
};

BrandCategoriesView.propTypes = {
  brandUrlKey: PropTypes.string.isRequired,
  showCount: PropTypes.bool,
  filledStyle: PropTypes.bool,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      count: PropTypes.number,
    }),
  ).isRequired,
};

export const BrandCategoriesViewWrapper = withDependencySupport(BaseBrandCategoriesViewWrapper, 'BrandCategoriesViewWrapper');
