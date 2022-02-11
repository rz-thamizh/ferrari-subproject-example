import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Config from '@/config';
import { useMutation } from '@apollo/client';
import { EnquiryFormView } from '@/roanuz/view/product/enquiryForm';
import { ProductEnquiryMutation } from '@/store/customer/query';

const EnquiryFormControllerWrapper = styled.div`
`;

export const EnquiryFormController = ({ product }) => {
  const [
    sendForm,
    { loading, error, data },
  ] = useMutation(ProductEnquiryMutation, {
    onCompleted: (saveData) => {
      if (saveData && !error) {
        // setTimeout(() => {
        //   onDone();
        // }, 2000);
      } else {
        console.log('Error in send email', error, saveData);
      }
    },
  });

  const handleForm = (formData) => {
    const variables = {
      // TODO: This should be moved to Magento
      recipientsEmail: Config.EnquiryFormRecipientsEmail,
      productId: product.id,
      ...formData,
    };
    sendForm({ variables });
  };

  return (
    <EnquiryFormControllerWrapper>
      <EnquiryFormView
        product={product}
        onSave={handleForm}
        saving={loading}
        saveError={error}
        saveSuccess={data}
      />
    </EnquiryFormControllerWrapper>
  );
};

EnquiryFormController.propTypes = {
  product: PropTypes.object.isRequired,
};
