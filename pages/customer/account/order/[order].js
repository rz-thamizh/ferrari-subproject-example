import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from 'styled-components';
import { Breakpoint, asRem } from '@/roanuz/lib/css';
import { useQuery } from '@apollo/client';
import { CustomerOrderQuery } from '@/store/customer/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { StoreConfigContext, shouldRedirectForLogin } from '@/store/core/context';
import { OrderView } from '@/roanuz/view/customer/order';
import { parseOrder } from '@/store/customer/model';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';

const OrderPageWrapper = styled.div`
  .rz-page-content {
    margin-top: ${asRem(20)};
    padding: 0;
    @media screen and (min-width: ${Breakpoint.sm}) {
      margin-top: ${asRem(60)};
      padding: 0 var(--space-page-side-padding);
    }
  }
`;

export const OrderPage = ({ orderNumber }) => {
  const storeConfig = useContext(StoreConfigContext);
  const { loading, error, data: order } = useQuery(CustomerOrderQuery, {
    variables: { orderNumber },
  });

  console.log('Order', orderNumber, order, error, loading);
  if (loading) return (<PageLoadingView />);
  if (error) return (<PageErrorView error={error} />);
  if (!order) return (<PageLoadingView />);
  const parsedOrder = parseOrder(order, storeConfig.product_url_suffix);
  return (
    <OrderPageWrapper>
      <Head>
        <title>
          Pöntun
          {' '}
          {parsedOrder.orderNumber}
        </title>
        <meta name="description" content={`Order # ${parsedOrder.orderNumber}`} />
      </Head>
      <div className="rz-page-content">
        <FormWrapperStyle>
          <OrderView order={parsedOrder} />
        </FormWrapperStyle>
      </div>
    </OrderPageWrapper>
  );
};

export async function getServerSideProps({ params, req, res }) {
  const redirect = await shouldRedirectForLogin({ req, res });
  if (redirect) {
    return redirect;
  }
  return { props: { orderNumber: params.order } };
}

OrderPage.propTypes = {
  orderNumber: PropTypes.string,
};

export default OrderPage;
