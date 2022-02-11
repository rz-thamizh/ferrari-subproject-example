import React from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/client';
import { MyAddressView } from '@/roanuz/view/customer/myAddress';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { CustomerAddressesQuery, DeleteCustomerAddress } from '@/store/customer/query';

const MyAddressControllerWrapper = styled.div`
  width: 100%;

  @media screen and (min-width: ${Breakpoint.sm}) {
    padding: ${asRem(20)} 0 0 ${asRem(20)};
  } 
`;

export const MyAddressController = () => {
  const {
    loading,
    error,
    data: addressBookData,
  } = useQuery(CustomerAddressesQuery);

  const [deleteAddress, { error: deleteAddressError }] = useMutation(DeleteCustomerAddress, {
    onCompleted: (deletedData) => {
      // Ensure customer data is deleted
      if (deletedData.deleteCustomerAddress) {
        console.log('✅ Customer address deleted', deletedData, deleteAddressError);
      }
    },
    refetchQueries: [{ query: CustomerAddressesQuery }],
  });

  const onDelete = (variables) => {
    deleteAddress({ variables });
  };

  return (
    <MyAddressControllerWrapper>
      { loading && (<PageLoadingView message="Sæki heimilisföng" />) }
      { error && (<PageErrorView error={error} />) }
      { addressBookData && (
        <MyAddressView
          addressBookData={addressBookData}
          onDelete={onDelete}
        />
      )}
    </MyAddressControllerWrapper>
  );
};

MyAddressController.propTypes = {
};
