import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { PaymentCaptureBorgunMutation } from '@/store/cart/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import { shouldRedirectToCheckOutPage } from '@/store/core/context';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';
import PageErrorView from '@/components/utils/PageErrorView';
import { useWaitForClientSide } from '@/roanuz/hooks/core';

const PaymentResponseHandlerWrapper = styled(FormWrapperStyle)`
  margin-top: ${asRem(20)};
`;

export const PaymentResponseHandler = ({
  method, rawFormData,
}) => {
  const router = useRouter();
  const clientReady = useWaitForClientSide();
  const [capture, { loading, error, data }] = useMutation(PaymentCaptureBorgunMutation);

  const urlSearchParams = new URLSearchParams(rawFormData);
  const params = Object.fromEntries(urlSearchParams.entries());
  const {
    orderid, authorizationcode, status, orderhash,
  } = params;

  useEffect(() => {
    if (clientReady) {
      console.log('Borgun-Capture');
      if (params.status !== 'ERROR') {
        capture({
          variables: {
            orderid,
            authorizationcode,
            status,
            orderhash,
          },
        });
      } else {
        shouldRedirectToCheckOutPage(router, method);
      }
    }
  }, [clientReady]);

  if (!clientReady) return (<PageLoadingView />);

  if (params.status === 'ERROR') {
    return (<PageErrorView error={{ message: 'Failed. Please Try again.' }} />);
  }

  if (loading) return (<PageLoadingView />);
  if (error) {
    shouldRedirectToCheckOutPage(router, method);
    const errorMessage = {
      message: `${error}. Redirecting to Checkout`,
    };
    return (<PageErrorView error={errorMessage} />);
  }

  console.log('Capture Status', method, data);
  if (data && data.rzPaymentBorgunConfirmation && !data.rzPaymentBorgunConfirmation.status) {
    shouldRedirectToCheckOutPage(router, method);
    const errorMessage = {
      message: 'Failed. Please Try again. Redirecting to Checkout',
    };
    return (<PageErrorView error={errorMessage} />);
  }

  if (data) {
    console.log('Processing Done');
    window.location.href = '/customer/latest-order/';
  }

  return (
    <PaymentResponseHandlerWrapper>
      <Head>
        <title>
          Afgreiði greiðslu
        </title>
        <meta name="description" content="Processing Payments" />
      </Head>
      Vinnsla
    </PaymentResponseHandlerWrapper>
  );
};

export async function getServerSideProps({ query, req }) {
  const requestBodyPromise = new Promise((resolve) => {
    let postBody = '';

    req.on('data', (data) => {
      postBody += data.toString();
    });

    req.on('end', () => {
      resolve(postBody);
    });
  });
  return { props: { method: 'borgun_gateway', query, rawFormData: await requestBodyPromise } };
}

PaymentResponseHandler.propTypes = {
  method: PropTypes.string,
  rawFormData: PropTypes.string,
};

export default PaymentResponseHandler;
