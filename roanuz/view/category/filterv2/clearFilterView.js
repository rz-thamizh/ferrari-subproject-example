import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ReactComponent as CloseIcon } from '@/roanuz/view/imgs/CloseIcon.svg';
import { TextBold16, TextMedium14 } from '@/roanuz/typopgraphy';
import { asRem } from '@/roanuz/lib/css';
import { formatPriceLabel } from '@/roanuz/lib/cart';
import { Button } from '../../button';
import { SVGIcon } from '../../icon';

const ClearFilterWrapper = styled.div`
  border-bottom: ${asRem(1)} solid var(--color-disabled-3);
  padding-bottom: ${asRem(20)};
  margin-bottom: ${asRem(20)};
  >.active-filters {
    padding-top: ${asRem(15)};
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    div.item {
      border: ${asRem(1)} solid var(--color-disabled-3);
      padding: ${asRem(10)};
      border-radius: ${asRem(6)};
      margin: ${asRem(5)} ${asRem(10)} ${asRem(5)} 0;
      display: flex;
      align-items: center;
      >p {
        padding-right: ${asRem(8)};
      }
      >div {
        cursor: pointer;
        color: var(--color-button);
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  >.button-wrap {
    text-align: right;
    >button {
      text-decoration: underline;
      transition: none;
      >span {
        opacity: initial;
      }
    }
  }
`;

export const ClearFilterView = ({
  activeFiltersList,
  onClearAllFilters,
  onClearIndividualFilter,
  aggregationsInfo,
}) => {
  return (
    <ClearFilterWrapper className="active-filters-list">
      <TextBold16>Virk sía</TextBold16>
      <div className="active-filters">
        {Object.keys(activeFiltersList).map((activeFilter) => (
          <>
            {activeFilter !== 'page'
              && activeFiltersList[activeFilter]
              && activeFiltersList[activeFilter].split(',')
              && activeFiltersList[activeFilter].split(',').map((item) => (
                <div className="item" key={item}>
                  {(aggregationsInfo[activeFilter][item] || item) && (
                    <>
                      <TextMedium14>
                        {aggregationsInfo[activeFilter]
                          && aggregationsInfo[activeFilter][item] ? (
                            aggregationsInfo[activeFilter][item].label
                          ) : (
                            formatPriceLabel(activeFiltersList[item] || item.replace('_', '-')) // For price ranger
                          )}
                      </TextMedium14>
                      <SVGIcon heightPx={16}>
                        <CloseIcon
                          onClick={() => onClearIndividualFilter(
                            activeFilter,
                            item,
                            activeFilter === 'price',
                          )}
                        />
                      </SVGIcon>
                    </>
                  )}
                </div>
              ))}
          </>
        ))}
      </div>
      <div className="button-wrap">
        <Button
          onClick={() => onClearAllFilters()}
          noborder
        >
          <TextMedium14>Hreinsa</TextMedium14>
        </Button>
      </div>
    </ClearFilterWrapper>
  );
};

ClearFilterView.propTypes = {
  activeFiltersList: PropTypes.object,
  onClearAllFilters: PropTypes.func,
  onClearIndividualFilter: PropTypes.func,
  aggregationsInfo: PropTypes.object,
};
