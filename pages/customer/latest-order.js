import React, { useContext } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { useWaitForClientSide } from '@/roanuz/hooks/core';
import { UserContext } from '@/store/core/context';
import { useRouter } from 'next/router';
import { LocalCartStorage, LocalOrderStorage, afterSuccessPayment } from '@/roanuz/lib/cart';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { OrderView } from '@/roanuz/view/customer/order';
import { parseOrderFromCart } from '@/store/customer/model';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';

const LatestOrderPageWrapper = styled.div`
  .rz-page-content {
    margin-top: ${asRem(20)};
    padding: 0;
    @media screen and (min-width: ${Breakpoint.sm}) {
      margin-top: ${asRem(60)};
      padding: 0 var(--space-page-side-padding);
    }
  }
  >h1 {
    // padding-top: ${asRem(60)};
    padding-bottom: ${asRem(20)};
    margin-bottom: ${asRem(10)};
    border-bottom: 1px solid var(--color-disabled-3);
  }
`;

export const LatestOrderPage = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const clientReady = useWaitForClientSide();
  if (!clientReady) return (<PageLoadingView />);
  afterSuccessPayment();

  const order = LocalOrderStorage.fetch();
  if (!order || !order.orderNumber) {
    return (<PageErrorView error={{ message: 'No order found!' }} />);
  }

  if (order && order.orderNumber && userContext.token) {
    const nextPath = '/customer/account/order/[order]';
    router.push({
      pathname: nextPath,
      query: { order: order.orderNumber },
    });
  }

  const cart = LocalCartStorage.fetch();
  if (!cart || !cart.id) {
    return (<PageErrorView error={{ message: 'No order found!' }} />);
  }

  const parsedOrder = parseOrderFromCart(cart, order);

  return (
    <LatestOrderPageWrapper>
      <Head>
        <title>
          Síðasta pöntunin þín
          {' '}
          {order.orderNumber}
        </title>
        <meta name="description" content={`Your latest order ${order.orderNumber}`} />
      </Head>
      <div className="rz-page-content">
        {!userContext.token
          ? <FormWrapperStyle><OrderView order={parsedOrder} /></FormWrapperStyle>
          : <PageLoadingView />}
      </div>
    </LatestOrderPageWrapper>
  );
};

LatestOrderPage.propTypes = {
};

export async function getServerSideProps() {
  return { props: { } };
}

export default LatestOrderPage;
