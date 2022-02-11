import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import { MyOrderView } from '@/roanuz/view/customer/myOrder';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { CustomerSummaryQuery } from '@/store/customer/query';
import { asRem, Breakpoint } from '@/roanuz/lib/css';

const MyOrdersControllerWrapper = styled.div`
  width: 100%;

  @media screen and (min-width: ${Breakpoint.sm}) {
    padding: ${asRem(20)} 0 0 ${asRem(20)};
  }  
`;

export const MyOrdersController = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { loading, error, data } = useQuery(CustomerSummaryQuery, {
    variables: {
      currentPage,
    },
  });

  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <MyOrdersControllerWrapper>
      { loading && (<PageLoadingView message="Undirbý pöntun" />) }
      { error && (<PageErrorView error={error} />) }
      { data && (<MyOrderView summary={data} onPageChange={onPageChange} />) }
    </MyOrdersControllerWrapper>
  );
};

MyOrdersController.propTypes = {
};
