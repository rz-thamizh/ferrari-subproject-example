import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Breakpoint, asRem } from '@/roanuz/lib/css';
import { useMutation, useQuery } from '@apollo/client';
import { CustomerAddressesQuery, UpdateCustomerAddressMutation } from '@/store/customer/query';
import { shouldRedirectForLogin, UserContext } from '@/store/core/context';
import PageLoadingView from '@/components/utils/PageLoadingView';
import PageErrorView from '@/components/utils/PageErrorView';
import { NewAddressView } from '@/roanuz/view/customer/newAddress';
import { ClientSideView } from '@/roanuz/clientSide';
import { MyAccountPageLayout } from '@/roanuz/layout/customer/myAccountPage';
import Router from 'next/router';

const EditAddressPageWrapper = styled.div`
`;

const EditAddressViewWrapper = styled.div`
 width: 100%;
  padding: ${asRem(20)} 0;

  @media screen and (min-width: ${Breakpoint.sm}) {
    padding: ${asRem(20)} 0 0 ${asRem(20)};
  }
`;

export const EditAddressPage = ({ addressId }) => {
  const [saving, setSaving] = useState(false);

  const userContext = useContext(UserContext);

  const { loading, error: addressBookDataError, data: addressBookData } = useQuery(
    CustomerAddressesQuery, {
      skip: !userContext.token,
    },
  );

  const filteredAddress = addressBookData
  && addressBookData.customer && addressBookData.customer.addresses.find((i) => {
    if (i.id.toString() === addressId) {
      return i;
    }

    return null;
  });

  const [updateCustomerAddress, { error }] = useMutation(UpdateCustomerAddressMutation, {
    onCompleted: (updatedData) => {
      // Ensure customer address is updated
      if (updatedData) {
        console.log('✅ Customer Address updated', updatedData, error);
        Router.push('/customer/account/address');
      } else {
        setSaving(false);
      }
    },
    refetchQueries: [{ query: CustomerAddressesQuery }],
  });

  const onSave = (variables) => {
    setSaving(true);
    updateCustomerAddress({
      variables: {
        id: parseInt(addressId, 10),
        city: variables.city,
        telephone: variables.telephone,
        street: variables.street,
        company: variables.company,
        firstname: variables.firstname,
        lastname: variables.lastname,
        postcode: variables.postcode,
        default_shipping: variables.default_shipping,
        default_billing: variables.default_billing,
        ssn: variables.ssn,
      },
    });
    setSaving(false);
  };

  if (loading) return (<PageLoadingView />);
  if (addressBookDataError) return (<PageErrorView error={addressBookDataError} />);
  if (!addressBookData) return (<PageLoadingView />);

  return (
    <ClientSideView>
      <EditAddressPageWrapper>
        <MyAccountPageLayout
          pageTitle="Heimilisföng"
          title="Add an address"
        >
          <EditAddressViewWrapper>
            <NewAddressView
              onSave={onSave}
              saving={saving}
              saveError={error}
              filteredAddress={filteredAddress}
            />
          </EditAddressViewWrapper>
        </MyAccountPageLayout>
      </EditAddressPageWrapper>
    </ClientSideView>
  );
};

export async function getServerSideProps({ params, req, res }) {
  const redirect = await shouldRedirectForLogin({ req, res });
  if (redirect) {
    return redirect;
  }
  return { props: { addressId: params.edit } };
}

EditAddressPage.propTypes = {
  addressId: PropTypes.string,
};

export default EditAddressPage;
