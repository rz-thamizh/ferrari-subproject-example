import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { DisplayMedium18, DisplayBold24, Display18 } from '@/roanuz/typopgraphy';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { SVGIcon } from '@/roanuz/view/icon';
import Link from 'next/link';

export const BottomContentViewWrapper = styled.div`
  .items {
    padding: ${asRem(60)} ${asRem(20)};
    display: flex;
    flex-flow: column;

    >.item {
      color: inherit;
      text-align: center;
      margin-bottom: ${asRem(20)};

      &:hover {
        text-decoration: none;
      }

      >.bottom-container {
        >.title {
          padding-bottom: ${asRem(20)};
        }
  
        >.desc {
          padding-top: ${asRem(4)};
        }
      }

      &:last-child {
        margin-right: 0;
      }
    }
    @media screen and (min-width: ${Breakpoint.sm}) {
      flex-flow: row;
      padding: ${asRem(60)} ${asRem(80)};
      >.item {
        margin-right: ${asRem(40)};
      }
    }
  }
`;

export const BottomContentView = ({ items }) => {
  return (
    <BottomContentViewWrapper>
      <div className="items rz-page-content rz-bottom-content-service-promise">
        {items.map((item) => (
          <Link
            href={item.slug}
            key={item.title}
          >
            <a
              className="item"
            >
              {item.image && (
                <SVGIcon
                  heightPx={60}
                  useOriginal
                >
                  {item.image}
                </SVGIcon>
              )}
              <div className="bottom-container">
                {item.title && (
                  <DisplayBold24 className="title">{item.title}</DisplayBold24>
                )}
                {item.subtitle && (
                  <DisplayMedium18 className="sub-title">{item.subtitle}</DisplayMedium18>
                )}
                { item.desc && (
                  <Display18 className="desc">{item.desc}</Display18>
                ) }
              </div>
            </a>
          </Link>
        ))}
      </div>
    </BottomContentViewWrapper>
  );
};

BottomContentView.propTypes = {
  items: PropTypes.array,
};
