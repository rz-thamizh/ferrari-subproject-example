import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import {
  Bold,
  DisplayBold20,
  TextMedium16,
  TextMedium16Anchor,
  TextMedium14,
} from '@/roanuz/typopgraphy';
import { ReactComponent as RightArrow } from '@/roanuz/view/imgs/RightArrow.svg';
import { SVGIcon } from '@/roanuz/view/icon';

const StoresListViewWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .stores {
    display: flex;
    width: auto;
    overflow-x: auto;

    @media screen and (min-width: ${Breakpoint.sm}) {
      width: auto;
    }

    .stores-inner-container {
      text-align: center;
      margin-right: ${asRem(12)};

      img {
        max-width: ${asRem(54)};
      }

      & .active-border {
        margin-top: ${asRem(10)};
        border-radius: 50%;
        width: ${asRem(68)};
        height: ${asRem(68)};
        border: ${asRem(2)} solid var(--color-text-rev);
        display: flex;
        align-items: center;
        justify-content: center;

        & :hover {
          cursor: pointer;
          border-color: var(--color-button);
          transition: all 800ms;
        }

        img {
          border-radius: 50%;
        }

        &.active {
          border-color: var(--color-button);
        }
      }
    }
  }

  .stores-information {
    display: flex;
    margin-top: ${asRem(20)};
    padding-bottom: ${asRem(20)};

    .address-section {
      min-width: ${asRem(166)};
      padding-right: ${asRem(10)};

      @media screen and (min-width: ${Breakpoint.sm}) {
        padding-right: ${asRem(30)};   
        min-width: ${asRem(188)};
      }
    }

    .address-section {
      h4,
      p,
      a {
        margin-bottom: ${asRem(10)};
      }

      .contact-number {
        display: block;
        color: var(--color-text);
      }

      .direction-arrow {
        padding-left: ${asRem(5)};
      }
    }

    .opening-hours {
      margin-left: ${asRem(16)};
      min-height: ${asRem(228)};
  
      div {
        margin-bottom: ${asRem(20)};
      }
    }
  }

  ${(p) => (p.displayMode === 'kunigund-view') && css`
    @media screen and (min-width: ${Breakpoint.md}) {
      flex-direction: row;
    }
    .stores {
      @media screen and (min-width: ${Breakpoint.md}) {
        flex-direction: column;
      }
      >div {
        margin-bottom: ${asRem(15)};
      }
      .stores-inner-container {
        .active-border {
          margin-top: ${asRem(5)};
          border-color: var(--color-button-hover);
          &.active {
            border-color: var(--color-text-rev);
          }
        }
      }
    }
    .stores-information {
      margin-top: 0;
      padding-bottom: 0;
      @media screen and (min-width: ${Breakpoint.md}) {
        margin-left: ${asRem(40)};
      }
      .address-section {
        min-width: initial;
        padding-right: ${asRem(40)};
        a, .contact-number {
          color: var(--color-text-rev);
        }
      }
    }
  `}
  
  .hours-link {
    margin-top: ${asRem(15)};
  }
`;

export const StoresListView = ({ stores, displayMode }) => {
  const [activeStore, setActiveStore] = useState(stores[0]);

  const clickHandler = (id) => {
    const currentObj = stores[id];
    setActiveStore(currentObj);
  };
  return (
    <StoresListViewWrapper
      className="stores-list-wrapper"
      displayMode={displayMode || null}
    >
      <div className="stores">
        {stores.map((store) => (
          <div
            id={store.id}
            key={store.id}
            className="stores-inner-container"
          >
            <Bold small className="title">
              {store.title}
            </Bold>
            <div id={store.id} className={`active-border ${store.id === activeStore.id ? 'active' : ''}`}>
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <img
                src={store.img}
                alt={`${store.title} Store logo`}
                onClick={(e) => clickHandler(e.target.parentNode.id)}
                onKeyPress={(e) => clickHandler(e.target.parentNode.id)}
                onMouseEnter={(e) => clickHandler(e.target.parentNode.id)}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="stores-information">
        <div className="address-section">
          <DisplayBold20>{activeStore.title}</DisplayBold20>
          <TextMedium16 className="detail-text">
            {activeStore.detailText}
            <a href={`tel:${activeStore.contactNumber}`} className="contact-number">
              {activeStore.contactNumber}
            </a>
          </TextMedium16>
          {activeStore.googleMapLocation && (
            <TextMedium16Anchor
              target="_blank"
              href={activeStore.googleMapLocation}
              className="link blue"
              title="Get directions"
            >
              Sýna leið
              <span className="direction-arrow">
                <SVGIcon
                  heightPx={10}
                >
                  <RightArrow />
                </SVGIcon>
              </span>
            </TextMedium16Anchor>
          )}
        </div>
        <div className="opening-hours">
          <>
            {activeStore.virkirDagarFrom && activeStore.virkirDagarTo && (
              <div>
                <TextMedium14>Virkir dagar</TextMedium14>
                <TextMedium16 className="detail-text">
                  {activeStore.virkirDagarFrom}
                  {' '}
                  -
                  {' '}
                  {activeStore.virkirDagarTo}
                </TextMedium16>
              </div>
            )}
            {activeStore.laugardagurFrom && activeStore.laugardagurTo && (
              <div>
                <TextMedium14>Laugardagur</TextMedium14>
                <TextMedium16 className="detail-text">
                  {activeStore.laugardagurFrom}
                  {' '}
                  -
                  {' '}
                  {activeStore.laugardagurTo}
                </TextMedium16>
              </div>
            )}
            {activeStore.sunnudagurFrom && activeStore.sunnudagurTo && (
              <div>
                <TextMedium14>Sunnudagur</TextMedium14>
                <TextMedium16 className="detail-text">
                  {activeStore.sunnudagurFrom}
                  {' '}
                  -
                  {' '}
                  {activeStore.sunnudagurTo}
                </TextMedium16>
              </div>
            )}
            {activeStore.LaugardagurAndSunnudagurFrom && activeStore.LaugardagurAndSunnudagurTo && (
              <div>
                <TextMedium14>
                  Laugardagur, Sunnudagur
                </TextMedium14>
                <TextMedium16 className="detail-text">
                  {activeStore.LaugardagurAndSunnudagurFrom}
                  {' '}
                  -
                  {' '}
                  {activeStore.LaugardagurAndSunnudagurTo}
                </TextMedium16>
              </div>
            )}
          </>
        </div>
      </div>
    </StoresListViewWrapper>
  );
};

StoresListView.propTypes = {
  stores: PropTypes.arrayOf(PropTypes.object),
  displayMode: PropTypes.string,
};
