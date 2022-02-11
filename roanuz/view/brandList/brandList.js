import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import Link from 'next/link';
import { createBrandKey } from '@/roanuz/view/brand/model';
import { Display18 } from '@/roanuz/typopgraphy';

const BrandListViewWrapper = styled.div`
  padding-top: ${asRem(40)};

  h1 {
    padding: ${asRem(20)} 0;
    border-bottom: ${asRem(1)} solid var(--color-border-2);
    margin-bottom: ${asRem(30)};
    font-size: ${asRem(30)};
    font-weight: 900;
    line-height: ${asRem(40)};
  }

  .links {
    display: grid;
    text-align: center;
    grid-gap: ${asRem(16)};

    @media screen and (min-width: ${Breakpoint.sm}) {
      grid-template-columns: repeat(4, 1fr);
    }

    a {
      &:hover {
        color: #23527c;
        text-decoration: none;
      }
    }
  }
`;

export const BrandListView = ({ brands }) => {
  // Sorting array alphabeticaly
  const sortedArray = brands && [...brands].sort(
    (x, y) => x.label.localeCompare(y.label, undefined, { numeric: true }),
  );

  return (
    <BrandListViewWrapper>
      <h1>Vörumerki</h1>
      <div className="links">
        {sortedArray && sortedArray.map((brand) => (
          <div key={createBrandKey(brand.label)}>
            <Link href={`brand/${createBrandKey(brand.label)}`}>
              <a title={brand.label}>
                <Display18 as="span">
                  {brand.label}
                </Display18>
              </a>
            </Link>
          </div>
        ))}
      </div>
    </BrandListViewWrapper>
  );
};

BrandListView.propTypes = {
  brands: PropTypes.object,
};
