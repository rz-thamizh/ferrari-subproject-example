import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from 'styled-components';
import { asRem } from '@/roanuz/lib/css';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { PaymentCaptureNetgiroMutation } from '@/store/cart/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import { shouldRedirectToCheckOutPage } from '@/store/core/context';
import { FormWrapperStyle } from '@/roanuz/formWrapperStyle';
import PageErrorView from '@/components/utils/PageErrorView';
import { useWaitForClientSide } from '@/roanuz/hooks/core';

const PaymentResponseHandlerWrapper = styled(FormWrapperStyle)`
  margin-top: ${asRem(20)};
`;

export const PaymentResponseHandler = ({ method, query }) => {
  // This should be moved to API Gateway or any server side services
  // Sample request
  // http://localhost:3000/customer/payment-response/netgiro/?transactionid=3982ff0e-6cc3-4c05-8306-46e6db2a29dd&referenceNumber=15&invoiceNumber=301982&status=2&accountNumber=500004&orderid=15&confirmationCode=3982ff0e-6cc3-4c05-8306-46e6db2a29dd&success=True&paymentCode=200&netgiroSignature=ef82fa51454153a33eaeb9ce08b88e80af91591e2f06df1fd3608e34c85813aa&totalAmount=136000&signature=a903ed5e35c1bde88b587be44efeb8355d419d8564572b63f01edb9b5fdc86e9&name=-&email=-&paymentSuccessful=True&address=Some%20Address%2010&address2=&city=Reykjav%C3%ADk&country=Iceland&zip=111

  const router = useRouter();
  const clientReady = useWaitForClientSide();
  const [capture, { loading, error, data }] = useMutation(PaymentCaptureNetgiroMutation);

  const { orderid: orderNumber, success = false, signature } = query;
  useEffect(() => {
    if (clientReady) {
      console.log('Netgiro-Capture');
      capture({ variables: { orderNumber, success, signature } });
    }
  }, [clientReady]);

  if (!clientReady) return (<PageLoadingView />);

  // const { orderid: orderNumber, success = false, signature } = query;

  // capture({ variables: { orderNumber, success, signature } });

  if (loading) return (<PageLoadingView />);
  if (error) {
    shouldRedirectToCheckOutPage(router, method);
    const errorMessage = {
      message: `${error}. Redirecting to Checkout`,
    };
    return (<PageErrorView error={errorMessage} />);
  }

  console.log('Capture Status', method, data);
  if (data && data.rzPaymentCaptureNetgiro && !data.rzPaymentCaptureNetgiro.status) {
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

export async function getServerSideProps({ query }) {
  return { props: { method: 'netgiro', query } };
}

PaymentResponseHandler.propTypes = {
  method: PropTypes.string,
  query: PropTypes.object,
};

export default PaymentResponseHandler;
