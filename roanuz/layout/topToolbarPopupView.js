import styled, { css } from 'styled-components';
import { asRem } from '../lib/css';

export const toolbarPopupView = styled.div`
position: relative;

  .mini-view-container {
    position: absolute;
    z-index: 100;
    right: 0;
    background: var(--color-text-rev);
    color: var(--color-text);
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08);
    border-radius: 6px;
    width: ${asRem(320)};

    font-size: ${asRem(18)};
    line-height: ${asRem(24)};

    height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: calc(100vh - 100px);

    padding: ${asRem(20)};
    height: auto;
    transform-origin: top right;
    transition: all 450ms cubic-bezier(0.16, 1, 0.3, 1);    
    transform: scale(0);

    ${(p) => p.show && css`
      transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
      transform: scale(1);
    `}

    h4 {
      padding-bottom: ${asRem(20)};
    }

    .items {
      a {
        color: var(--color-text);
      }
      .item {
        margin-bottom: ${asRem(14)};
        padding-bottom: ${asRem(14)};
        border-bottom: 1px solid var(--color-disabled-3);
        .tools {
          text-align: right;
        }

        .rz-product-preview {
          .right {
            justify-content: start;
          }

          .container-image {
            height: ${asRem(80)};
          }

          .container-heading {
            padding-bottom: 0;
          }
          .sku {
            display: none;
          }
          .price {
            font-size: ${asRem(16)};
            line-height: ${asRem(22)};
          }
        }
      }
    }

    .summary, .ctc {
      padding-bottom: ${asRem(14)};
      text-align: right;

      strong {
        font-weight: bold;
      }
      a {
        text-decoration: none;
      }
    }

  }
`;
