import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from 'styled-components';
// import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { PaymentCaptureNetgiroMutation, PaymentCaptureBorgunMutation } from '@/store/cart/query';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { useWaitForClientSide } from '@/roanuz/hooks/core';

const PaymentResponseHandlerWrapper = styled.div`
`;

export const PaymentResponseHandler = ({
  method, query, rawFormData,
}) => {
  console.log('method is ->', method, query, rawFormData);
  // This should be moved to API Gateway or any server side services
  // Sample request
  // http://localhost:3000/customer/payment-response/netgiro/?transactionid=3982ff0e-6cc3-4c05-8306-46e6db2a29dd&referenceNumber=15&invoiceNumber=301982&status=2&accountNumber=500004&orderid=15&confirmationCode=3982ff0e-6cc3-4c05-8306-46e6db2a29dd&success=True&paymentCode=200&netgiroSignature=ef82fa51454153a33eaeb9ce08b88e80af91591e2f06df1fd3608e34c85813aa&totalAmount=136000&signature=a903ed5e35c1bde88b587be44efeb8355d419d8564572b63f01edb9b5fdc86e9&name=-&email=-&paymentSuccessful=True&address=Some%20Address%2010&address2=&city=Reykjav%C3%ADk&country=Iceland&zip=111

  // const router = useRouter();
  const clientReady = useWaitForClientSide();

  let paymentCaptureQuery = null;
  switch (method) {
    case 'borgun':
      paymentCaptureQuery = PaymentCaptureBorgunMutation;
      break;
    case 'netgiro':
      paymentCaptureQuery = PaymentCaptureNetgiroMutation;
      break;
    default:
      paymentCaptureQuery = null;
  }
  const [capture, { loading, error, data }] = useMutation(paymentCaptureQuery);

  if (!clientReady) return (<PageLoadingView />);

  const { orderid: orderNumber, success = false, signature } = query;
  const urlSearchParams = new URLSearchParams(rawFormData);
  const params = Object.fromEntries(urlSearchParams.entries());
  const {
    orderid, authorizationcode, status, orderhash,
  } = params;

  // Call the capture API irrespect of status.
  // Capture API cancels the order when required
  // if (
  //   (method === 'netgiro' && !success) || (method === 'borgun' && !orderhash)
  // ) return (<PageErrorView error={{ message: 'Request cancelled. Try again.' }} />);

  let variables = null;
  switch (method) {
    case 'borgun':
      variables = {
        orderid, authorizationcode, status, orderhash,
      };
      break;
    case 'netgiro':
      variables = { orderNumber, success, signature };
      break;
    default:
      variables = null;
  }

  capture({ variables });
  if (loading) return (<PageLoadingView />);
  if (error) return (<PageErrorView error={error} />);

  console.log('Capture Status', method, data);
  if (
    (data && data.rzPaymentCaptureNetgiro && !data.rzPaymentCaptureNetgiro.status)
    || (data && data.rzPaymentBorgunConfirmation && !data.rzPaymentBorgunConfirmation.status)
  ) {
    return (<PageErrorView error={{ message: 'Failed. Try again.' }} />);
  }

  if (data) {
    console.log('Processing Done');
    // router.push('/customer/latest-order/');
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

export async function getServerSideProps({ params, query, req }) {
  const requestBodyPromise = new Promise((resolve) => {
    let postBody = '';

    req.on('data', (data) => {
      postBody += data.toString();
    });

    req.on('end', () => {
      resolve(postBody);
    });
  });
  return { props: { method: params.method, query, rawFormData: await requestBodyPromise } };
}

PaymentResponseHandler.propTypes = {
  method: PropTypes.string,
  query: PropTypes.object,
  rawFormData: PropTypes.string,
};

export default PaymentResponseHandler;
