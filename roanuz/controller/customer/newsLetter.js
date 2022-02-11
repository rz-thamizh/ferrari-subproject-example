import React from 'react';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { useMutation, useQuery } from '@apollo/client';
import { UpdateCustomerNewLetterMuation, CustomerProfileMiniQuery } from '@/store/customer/query';
import { NewsLetterView } from '@/roanuz/view/customer/newsLetter';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';

const NewsLetterControllerWrapper = styled.div`
  width: 100%;
  padding: ${asRem(20)} 0;

  @media screen and (min-width: ${Breakpoint.sm}) {
    padding: ${asRem(20)} 0 0 ${asRem(20)};
  }
`;

export const NewsLetterController = () => {
  const { data, loading, error: queryError } = useQuery(CustomerProfileMiniQuery);

  const [updateCustomer, { error }] = useMutation(UpdateCustomerNewLetterMuation, {
    onCompleted: (updatedData) => {
      // Ensure customer newletter is updated
      if (updatedData.updateCustomer) {
        console.log('✅ Customer newsletter updated', updatedData, error);
      }
    },
    refetchQueries: [{ query: CustomerProfileMiniQuery }],
  });

  const onSave = (variables) => {
    updateCustomer({ variables });
  };

  return (
    <NewsLetterControllerWrapper>
      { loading && (<PageLoadingView message="Hleð.. vinsamlegast bíðið" />) }
      { queryError && (<PageErrorView error={queryError} />) }
      { data && (
        <NewsLetterView
          onSave={onSave}
          saveError={error}
          data={data}
        />
      )}
    </NewsLetterControllerWrapper>
  );
};

NewsLetterController.propTypes = {
};
