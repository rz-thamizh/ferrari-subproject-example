import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@/roanuz/view/button';
import { DailogView } from '@/roanuz/view/dialog';
import styled from 'styled-components';
import Link from 'next/link';
import { ReactComponent as CloseIcon } from '@/roanuz/view/imgs/CloseIcon.svg';
import {
  LabelMedium12,
  TextMedium14,
  DisplayMedium20,
  DisplayBold24,
  Tiny,
} from '@/roanuz/typopgraphy';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import {
  formatCurrency as fc,
  formatPercentage as fp,
} from '@/roanuz/lib/cart';
import { ImageView } from '../image';
import { ProductPreviewView } from './preview';

export const SiminnLoanOptionsTitleViewWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  @media screen and (min-width: ${Breakpoint.sm}) {
    padding: ${asRem(20)} ${asRem(20)} ${asRem(28)};
  }

  >.rz-image-view {
    img {
      max-width: ${asRem(194)};
    }
  }
`;

export const SiminnLoanOptionsListWrapper = styled.div`
  --siminn-loan-color: #00AEF3;
  @media screen and (min-width: ${Breakpoint.sm}) {
    padding: 0 ${asRem(20)};
  }
  >.config-container {
    >.config-content {
      .container-image {
        width: ${asRem(80)};
        height: ${asRem(80)};
      }
      .right {
        flex-direction: column;
        justify-content: center;
        color: var(--color-text);
      }
      .container-price {
        padding-left: ${asRem(10)};
        strong {
          font-size: ${asRem(16)};
          line-height: ${asRem(22)};
          @media screen and (min-width: ${Breakpoint.sm}) {
            font-size: ${asRem(24)};
            line-height: ${asRem(32)};
          }
        }
      }
      .container-heading {
        padding-left: ${asRem(10)};
        padding-bottom: ${asRem(8)};
        .sku {
          display: none;
        }
        p {
          font-size: ${asRem(16)};
          line-height: ${asRem(22)};
          @media screen and (min-width: ${Breakpoint.sm}) {
            font-size: ${asRem(20)};
          }
        }
      }
      >p {
        font-weight: normal;
        margin-bottom: ${asRem(10)};
      }
    }
  }
  .plain {
    color: var(--color-button);
    font-weight: 500;
  }
  .loan-list {
    margin: ${asRem(18)} 0;
    >.loan-item {
      border-top: ${asRem(1)} solid var(--color-border-2);
      padding: ${asRem(20)} 0;
      &:last-child {
        border-bottom: ${asRem(1)} solid var(--color-border-2);
      }
      display: flex;
      justify-content: space-between;
      flex-direction: column;
      .loan-detail {
        margin-bottom: ${asRem(10)};
      }
      @media screen and (min-width: ${Breakpoint.sm}) {
        flex-direction: initial;
        .loan-detail {
          min-width: ${asRem(200)};
          margin-bottom: 0;
        }
      }
      .item-wrap {
        display: flex;
        justify-content: space-between;
        width: 100%;
        @media screen and (min-width: ${Breakpoint.sm}) {
          >div {
            flex: 1;
            text-align: center;
          }
          h4 {
            min-height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          >div {
            &:last-child {
              h4 {
                justify-content: flex-end;
              }
              .label {
                text-align: right;
              }
            }
          }
        }
      }
      .label {
        margin-top: ${asRem(5)};
        font-weight: lighter;
        >div {
          font-weight: lighter;
          strong {
            font-weight: 600;
          }
        }
      }
      &.recomended {
        position: relative;
        border-top-color: var(--siminn-loan-color);
        color: var(--siminn-loan-color);
        .label {
          color: var(--color-text);
        }
        small {
          position: absolute;
          top: 0;
          background-color: var(--siminn-loan-color);
          color: #fff;
          padding: ${asRem(2)} ${asRem(8)};
        }
      }
    }
  }
`;

export const SiminnLoanOptionsDailogView = ({
  SiminnImage,
  showAllOptions,
  product,
  options,
  selectedOption,
  setShowAllOptions,
}) => {
  return (
    <DailogView
      titleSection={(
        <SiminnLoanOptionsTitleViewWrapper>
          <ImageView src={SiminnImage} alt="Siminn Logo" />
          <div>
            <Button
              className="icon"
              icon={<CloseIcon />}
              noborder
              onClick={() => setShowAllOptions(false)}
              ariaLabel="Close Button"
            />
          </div>
        </SiminnLoanOptionsTitleViewWrapper>
      )}
      showClose
      show={showAllOptions}
      containerWidth="600px"
    >
      <SiminnLoanOptionsListWrapper>
        <div className="config-container">
          <div className="config-content">
            <ProductPreviewView
              shouldLinkTitle={false}
              product={product}
            />
            <div className="loan-list">
              {options.options.map((option) => (
                <div
                  key={option.loanLengthInMonths}
                  className={`loan-item ${
                    option.loanLengthInMonths === selectedOption.loanLengthInMonths ? 'recomended' : null
                  }`}
                >
                  {option.loanLengthInMonths === selectedOption.loanLengthInMonths
                    && (<Tiny>Vinsælast</Tiny>)}
                  <div className="loan-detail">
                    <div className="amount">
                      <DisplayBold24 as="span" className="amount-part">
                        {fc(option.averagePaymentAmount)}
                      </DisplayBold24>
                      <LabelMedium12 as="span" className="month-part">
                        ./mán
                      </LabelMedium12>
                    </div>
                    <div className="label">
                      <TextMedium14 as="div" className="amount-part">
                        Heildargreiðsla:
                        {' '}
                        <strong>{fc(option.totalRepayment)}</strong>
                      </TextMedium14>
                    </div>
                  </div>
                  <div className="item-wrap">
                    <div>
                      <DisplayMedium20>{option.loanLengthInMonths}</DisplayMedium20>
                      <TextMedium14 className="label" as="div">
                        Mánuði
                      </TextMedium14>
                    </div>
                    <div>
                      <DisplayMedium20>{fp(option.yearlyCostRatio)}</DisplayMedium20>
                      <TextMedium14 className="label" as="div">
                        Hlutfallstala
                      </TextMedium14>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <TextMedium14>
              Með Pay Léttkaup greiðir þú fyrir vörur með öruggum hætti og hefur
              14 daga til að dreifa greiðslum í allt að 36 mánuði.
              Þú getur sótt um Léttkaupskortið,
              óháð því hvar þú ert með síma- og bankaviðskipti.
            </TextMedium14>
            <TextMedium14>
              Nánar um
              {' '}
              <Link href="https://www.siminn.is/adstod/siminnpay#lettkaup" prefetch={false}>
                <a alt="Siminn Pay Léttkaup" className="plain" target="_blank" rel="noreferrer">
                  Siminn Pay Léttkaup
                </a>
              </Link>
            </TextMedium14>
          </div>
        </div>
      </SiminnLoanOptionsListWrapper>
    </DailogView>
  );
};

SiminnLoanOptionsDailogView.propTypes = {
  options: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  SiminnImage: PropTypes.string,
  showAllOptions: PropTypes.bool,
  selectedOption: PropTypes.any,
  setShowAllOptions: PropTypes.func,
};
