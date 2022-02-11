import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { DisplayBold30 } from '@/roanuz/typopgraphy';
import { Row, Col } from '@/roanuz/layout';
import { formatMoney } from '@/roanuz/lib/cart';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { ImageView } from '@/roanuz/view/image';
import { ReactComponent as SuccessCheckmarkIcon } from '@/roanuz/view/imgs/SuccessCheckmarkIcon.svg';
import PaymentMethodMillifaerslaImage from '@/roanuz/view/imgs/PaymentMethodMillifaersla.png';
import { RawHtmlView } from '@/roanuz/view/rawHtml';
import { translate } from '@/roanuz/lib/utils';
import { daysContext } from '@/roanuz/view/product/deliveryPickupView';
import Config from '@/config';

const OrderViewWrapper = styled.div`
  font-size: ${asRem(16)};
  line-height: ${asRem(20)};

  >h1 {
    // padding-top: ${asRem(20)};
    padding-bottom: ${asRem(10)};
    border-bottom: 1px solid var(--color-disabled-3);
    align-items: center;
    display: flex;
    color: var(--color-active-2);
    svg {
      width: ${asRem(28)};
      height: ${asRem(28)};
      margin-right: ${asRem(10)};
    }
    @media screen and (min-width: ${Breakpoint.sm}) {
      // padding-top: ${asRem(60)};
      padding-bottom: ${asRem(20)};
      margin-bottom: ${asRem(10)};
    }
  }

  .rz-row {
    flex-direction: column;
    @media screen and (min-width: ${Breakpoint.sm}) {
      flex-direction: initial;
    }
  }

  section {
    padding-top: ${asRem(20)};
    >p {
      padding-top: ${asRem(8)};
      &:first-child {
        padding-top: 0;
      }
      @media screen and (min-width: ${Breakpoint.sm}) {
        &:first-child {
          padding-top: ${asRem(8)};
        }
      }
      line-height: ${asRem(22)};

      .mail {
        word-wrap: break-word;
      }
    }
    strong {
      font-weight: bold;
    }
  }

  h4 {
    font-size: ${asRem(30)};
    line-height: ${asRem(40)};
    font-weight: bold;
  }

  >.order-section-overview {
    padding-top: ${asRem(20)};
    section {
      padding-top: 0;
    }
    >div:last-child {
      padding-top: ${asRem(20)};
      @media screen and (min-width: ${Breakpoint.sm}) {
        padding-top: 0;
      }
    }
  }

  >.order-section-shipping {
    margin-top: ${asRem(20)};
    border-radius: ${asRem(6)};
    padding: ${asRem(15)};
    background-color: var(--color-disabled-5);
    @media screen and (min-width: ${Breakpoint.sm}) {
      padding: ${asRem(30)};
    }
    >div {
      padding-bottom: ${asRem(20)};
      &:last-child {
        padding-bottom: 0;
      }
      @media screen and (min-width: ${Breakpoint.sm}) {
        padding-bottom: 0;
      }
    }
    >.rz-col {
      >section:not(.post-box-info) {
        padding-top: 0;
      }
      .post-box-info {
        >p {
          padding-top: 0;
        }
      }
    }
  }

  >.checkmo-details {
    margin-top: ${asRem(20)};
    border: ${asRem(1)} solid var(--color-border-2);
    border-radius: ${asRem(6)};
    padding: ${asRem(15)};
    @media screen and (min-width: ${Breakpoint.sm}) {
      align-items: center;
      padding: ${asRem(20)} ${asRem(30)};
    }
    p {
      margin-bottom: ${asRem(8)};
      &:last-child {
        margin-bottom: 0;
      }
    }
    strong {
      font-weight: bold;
    }
    .rz-image-view {
      width: ${asRem(160)};
      img {
        max-width: 100%;
      }
    }
  }

  >.order-section-items {
    border-top: 1px solid var(--color-disabled-3);
    margin-top: ${asRem(20)};
    padding-top: ${asRem(10)};
    table {
      margin: ${asRem(15)} 0;
      width: 100%;
      small {
        display: block;
        font-size: ${asRem(12)};
        line-height: ${asRem(16)};
        margin-top: ${asRem(8)};
        color: #777777;
      }

      th, td {
        padding: ${asRem(10)} ${asRem(10)};
        &.amount {
          text-align: right;
        }
        &:first-child {
          padding-left: 0;
        }
        &:last-child {
          padding-right: 0;
        }
      }

      td {
        &.summary-line {
          text-align: right;
        }
      }

      thead {
        th {
          text-align: left;
          font-weight: 500;
          border-bottom: ${asRem(1)} solid var(--color-disabled-3);
        }
      }

      tbody {
        .last-product-line {
          td {
            border-bottom: ${asRem(1)} solid var(--color-disabled-3);
          }
        }
        td:not(.summary-line) {
          border-bottom: 1px solid var(--color-disabled-3);
        }
        td.summary-line {
          padding-bottom: 0;
          &+.amount {
            padding-bottom: 0;
            border: 0;
          }
        }
      }
    }
  }

  .rz-row {
    .rz-col {
      flex: 1;
    }
  }

  .sameday {
    color: var(--color-active);
  }

`;

export const OrderView = ({
  order,
  inferredFromCart,
}) => {
  return (
    <OrderViewWrapper
      status={order.status}
    >
      <DisplayBold30 as="h1">
        <SuccessCheckmarkIcon />
        Staðfesting, takk fyrir viðskiptin
      </DisplayBold30>
      <section>
        <p>
          Staðfestingarpóstur hefur verið sendur á
          {' '}
          <a alt="Order email address" className="mail" href={`mailto:${order.email}`}>{order.email}</a>
        </p>
      </section>
      <Row className="order-section-overview">
        <Col>
          <section>
            <p>
              Pöntunarnúmer:
              {' '}
              <strong>{order.orderNumber}</strong>
            </p>
            <p>
              Dagsetning pöntunar:
              {' '}
              <strong>{order.date}</strong>
            </p>
            {order.paymentMethod.name && (
            <p>
              Geiðslumáti:
              {' '}
              <strong>{order.paymentMethod.name}</strong>
            </p>
            )}
          </section>
        </Col>
        <Col>
          <section>
            <p>Samtals</p>
            <h4>{formatMoney(order.total.total)}</h4>
          </section>
        </Col>
      </Row>
      {order.paymentMethod.type === 'checkmo' && (
        <Row className="checkmo-details">
          <Col>
            <ImageView
              src={PaymentMethodMillifaerslaImage}
              alt="Checkmo Logo"
            />
          </Col>
          <Col>
            <p>
              Kennitala:
              {' '}
              <strong>{Config.MerchantIdNumber}</strong>
            </p>
            <p>
              Reikningsnúmer:
              {' '}
              <strong>{Config.MerchantAccountNumber}</strong>
            </p>
            <p>
              Ef þú hefur einhverjar spurningar sendu okkur tölvupóst á
              {' '}
              <a href={`mailto:${Config.EnquiryFormRecipientsEmail}`}>{Config.EnquiryFormRecipientsEmail}</a>
            </p>
          </Col>
        </Row>
      )}
      <Row className="order-section-shipping">
        <Col>
          <section>
            <p>Móttakandi</p>
          </section>
          <section>
            <p>
              <strong>
                {order.address.firstname}
                {' '}
                {order.address.lastname && order.address.lastname !== '-' && order.address.lastname}
              </strong>
            </p>
            <p>
              Sími:
              {' '}
              <a href={`tel:${order.address.telephone}`}>{order.address.telephone}</a>
            </p>
            <p>
              Kennitala:
              {' '}
              {order.rzSSN}
            </p>
            <p>
              {order.address.street.join(', ')}
              {', '}
              {order.address.city}
              {', '}
              {order.address.postcode}
            </p>
          </section>
        </Col>
        <Col>
          <>
            <section>
              <p>Sendingarmáti</p>
            </section>
            <section>
              <p>
                <strong>
                  {order.shippingMethod}
                </strong>
              </p>
            </section>
            {order.extensionAttributes && (order.extensionAttributes.deliveryTimeFrom
              || order.extensionAttributes.deliveryTimeTo) ? (
                <section>
                  <p>
                    <strong>
                      Afgreiðslutími pantana:&nbsp;
                      {
                        daysContext(
                          order.extensionAttributes.deliveryTimeFrom,
                          order.extensionAttributes.deliveryTimeTo,
                        )
                      }
                    </strong>
                  </p>
                </section>
              ) : null}
            {order.extensionAttributes && order.extensionAttributes.postboxName && (
              <>
                <section className="post-box-info">
                  <p>{order.extensionAttributes.postboxName}</p>
                </section>
                <section>
                  <p>
                    {order.extensionAttributes.postboxAddress}
                  </p>
                </section>
              </>
            )}
            {order.extensionAttributes && order.extensionAttributes.pickupStore && (
              <>
                <section className="post-box-info">
                  <p>{order.extensionAttributes.pickupStore}</p>
                </section>
                <section>
                  <p>
                    <strong>
                      Afgreiðslutími pantana:&nbsp;
                      {
                        daysContext(
                          order.extensionAttributes.pickupTimeFrom,
                          order.extensionAttributes.pickupTimeTo,
                        )
                      }
                    </strong>
                  </p>
                </section>
                {order.extensionAttributes.pickupAddress && (
                  <section>
                    <p>
                      <RawHtmlView
                        html={order.extensionAttributes.pickupAddress || ''}
                      />
                    </p>
                  </section>
                )}
              </>
            )}
          </>
        </Col>
      </Row>
      <section>
        {order.shippingDescription && (
          <p>
            <RawHtmlView
              html={order.shippingDescription || ''}
            />
          </p>
        )}
      </section>
      <section className="order-section-items">
        {/* Didn't concentrate much on this design, since image is missing */}
        <table>
          <thead>
            <tr>
              <th>Vörur</th>
              <th>Magn</th>
              <th className="amount">Verð</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((item, i) => (
              <tr
                key={item.uid}
                className={`product-line ${i === (order.products.length - 1) ? 'last-product-line' : ''}`}
              >
                <td>
                  {item.product.name}
                  <small>{item.product.sku}</small>
                </td>
                <td>
                  {item.quantity}
                </td>
                <td className="amount">
                  {item.product.priceText}
                </td>
              </tr>
            ))}
            {order.total.discounts.map((item, i) => (
              <tr key={i}>
                <td className="summary-line" colSpan="2">{item.label}</td>
                <td className="amount">{formatMoney(item.amount)}</td>
              </tr>
            ))}
            <tr>
              <td className="summary-line" colSpan="2">Sendingarkostnaður</td>
              <td className="amount">{formatMoney(order.total.shipping)}</td>
            </tr>
            <tr>
              <td className="summary-line" colSpan="2">
                <strong>Samtals</strong>
              </td>
              <td className="amount">
                <strong>{formatMoney(order.total.total)}</strong>
              </td>
            </tr>
            {/* <tr>
              <td className="summary-line" colSpan="2">Þar af VSK</td>
              <td className="amount">{formatMoney(order.total.tax)}</td>
            </tr> */}
            {order.total.allTaxes.map((item, i) => (
              <tr key={i}>
                <td className="summary-line" colSpan="2">{translate(item.label || item.title)}</td>
                <td className="amount">{formatMoney(item.amount)}</td>
              </tr>
            ))}
            {/* <tr>
              <td className="summary-line" colSpan="2">
                <strong>Samtals VSK</strong>
              </td>
              <td className="amount">
                <strong>{formatMoney(order.total.tax)}</strong>
              </td>
            </tr> */}
          </tbody>
        </table>
      </section>
    </OrderViewWrapper>
  );
};

OrderView.propTypes = {
  order: PropTypes.object,
  inferredFromCart: PropTypes.bool,
};
