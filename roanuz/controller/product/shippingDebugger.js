import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useLazyQuery, useQuery } from '@apollo/client';
import { UserContext, StoreConfigContext } from '@/store/core/context';
import { onClient } from '@/roanuz/clientSide';
import { CustomerAddressesQuery } from '@/store/customer/query';
import { ShippingOptionsQuery } from '@/store/cart/query';
import { ErrorView, LoadingView } from '@/roanuz/view/status';
import { asRem } from '../../lib/css';

const ShippingDebuggerControllerWrapper = styled.div`
  margin: ${asRem(20)};
  padding: ${asRem(20)};
  border-radius: ${asRem(10)};
  background: #333;
  color: #fff;
  font-size: ${asRem(14)};
  line-height: ${asRem(18)};

  h2 {
    font-size: ${asRem(20)};
    padding: ${asRem(10)} 0;
  }

  section {
    padding: ${asRem(20)};
    display: flex;

    .section-item {
      margin-right: ${asRem(30)};
    }

    ul {
      li {
      }
    }
  }

  .days {
    padding: 0 ${asRem(10)};
  }

  table {
    thead {
      td {
        font-weight: bold;
      }
    }
    td {
      padding: ${asRem(5)};
      border-bottom: 1px solid;
    }
  }
`;

export const ShippingDebuggerController = ({ skus, quantity }) => {
  const userContext = useContext(UserContext);
  const {
    loading: customerDefaultAddressLoading,
    data: customerDefaultAddress,
    error: customerDefaultAddressError,
  } = useQuery(
    CustomerAddressesQuery, {
      skip: !userContext.token,
    },
  );

  const defaultAddressPinCode = customerDefaultAddress
  && customerDefaultAddress.customer
  && customerDefaultAddress.customer.addresses.find((i) => i.default_shipping);

  const zipcode = (defaultAddressPinCode && defaultAddressPinCode.postcode) || null;

  const [getShippingOption, {
    loading,
    data: shippingOptions,
    error,
    called,
  }] = useLazyQuery(ShippingOptionsQuery);

  useEffect(() => {
    if (!called && !customerDefaultAddressLoading) {
      const variables = {
        zipcode: zipcode ? `${zipcode}` : null,
        skus,
        quantity,
      };
      getShippingOption({ variables });
    }
  }, [customerDefaultAddress]);

  if (error || customerDefaultAddressError) {
    return (
      <ErrorView error={error || customerDefaultAddressError} />
    );
  }

  if (loading || customerDefaultAddressLoading) {
    return (
      <LoadingView />
    );
  }

  if (!shippingOptions) {
    return (
      <LoadingView />
    );
  }

  const options = shippingOptions.rzfShippingMethods.final;
  const methodsList = [...options.methods].sort((x, y) => x.method.uid > y.method.uid);

  // eslint-disable-next-line react/prop-types
  const DaysView = ({ days }) => {
    if (!days) {
      return (
        <span className="days">
          -
        </span>
      );
    }
    return (
      <span className="days">
        {days.min}
        {' - '}
        {days.max}
      </span>
    );
  };

  // eslint-disable-next-line react/prop-types
  const StoreStockView = ({ stock }) => {
    if (!stock) {
      return (
        <span className="stock">
          -
        </span>
      );
    }
    return (
      <span className="stock">
        {stock.store.name}
      </span>
    );
  };
  const YesNoView = ({ value }) => {
    return (
      <span className="yesno">
        {value
          ? ('✓')
          : ('x')}
      </span>
    );
  };

  return (
    <ShippingDebuggerControllerWrapper>
      <div>
        <section>
          <div className="section-item">
            <h2>Preferred / Best</h2>
            <ul>
              <li>
                Pickup:
                <DaysView days={options.preferred.best.pickup} />
              </li>
              <li>
                Delivery:
                <DaysView days={options.preferred.best.delivery} />
              </li>
            </ul>
          </div>
          <div className="section-item">
            <h2>Preferred / Wide</h2>
            <ul>
              <li>
                Pickup:
                <DaysView days={options.preferred.wide.pickup} />
              </li>
              <li>
                Delivery:
                <DaysView days={options.preferred.wide.delivery} />
              </li>
            </ul>
          </div>
          <div className="section-item">
            <h2>Warehouse Route</h2>
            {options.warehouseRoute && options.warehouseRoute.stock && (
              <ul>
                <li>
                  From Store:
                  {' '}
                  <StoreStockView stock={options.warehouseRoute.stock} />
                </li>
                <li>
                  Route Days:
                  {' '}
                  <DaysView days={options.warehouseRoute.days} />
                </li>
              </ul>
            )}
          </div>
          <div className="section-item">
            <h2>Params</h2>
            <ul>
              <li>
                Zipcode:
                {' '}
                {zipcode || '-'}
              </li>
              <li>
                Volume:
                {' '}
                {options.productMeta && (options.productMeta.volume || '-')}
              </li>
              <li>
                Assemble Days:
                {' '}
                {options.productMeta && (options.productMeta.assembleDays || '-')}
              </li>
              <li>
                Quantity:
                {' '}
                {quantity}
              </li>
            </ul>
          </div>
        </section>
        <section>
          <table>
            <thead>
              <tr>
                <td>#</td>
                <td>Price</td>
                <td>CG</td>
                <td>Method</td>
                <td>Location</td>
                <td>Cutoff</td>
                <td>Asse.</td>
                <td>Stock</td>
                <td>Route</td>
                <td>Pickup</td>
                <td>Delivery</td>
                <td>MBC ID</td>
              </tr>
            </thead>
            <tbody>
              {methodsList.map((method, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr key={i}>
                  <td>
                    {i + 1}
                    )
                  </td>
                  <td>{method.method.price}</td>
                  <td>{method.method.customerGroup}</td>
                  <td>{method.method.uid}</td>
                  <td>{method.method.location && method.method.location.stockCode}</td>
                  <td>
                    <YesNoView value={method.deliveryDays.cutOffTimeIncluded} />
                  </td>
                  <td>
                    <YesNoView value={method.deliveryDays.assembleTimeIncluded} />
                  </td>
                  <td>
                    {method.deliveryDays.stock && (
                      <YesNoView value={method.deliveryDays.stock.available} />
                    )}
                  </td>
                  <td>
                    {method.deliveryDays.routingStoreStock && (
                      <StoreStockView
                        stock={method.deliveryDays.routingStoreStock}
                      />
                    )}
                  </td>
                  <td>
                    <DaysView days={method.deliveryDays.pickup} />
                  </td>
                  <td>
                    <DaysView days={method.deliveryDays.delivery} />
                  </td>
                  <td>{method.method.mbcId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </ShippingDebuggerControllerWrapper>
  );
};

ShippingDebuggerController.propTypes = {
  skus: PropTypes.array.isRequired,
  quantity: PropTypes.number,
};

export const ClientShippingDebuggerController = onClient(
  ShippingDebuggerController,
);
