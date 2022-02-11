import React from 'react';
import { ContactUsPageLayout } from '@/roanuz/layout/contact/contactUsPage';
import { ContactUsFormView } from '@/roanuz/view/contact/contactUsForm';
import { SocialLinksView } from '@/roanuz/view/contact/socialLinksView';
import { MapView } from '@/roanuz/view/contact/mapView';
import { useMutation } from '@apollo/client';
import { RzContactFormMutation } from '@/store/customer/query';

export const ContactUsPageController = () => {
  const [
    sendContactForm,
    { loading, error, data },
  ] = useMutation(RzContactFormMutation);

  const onContactSubmission = async (update) => {
    const variables = {
      ...update,
    };
    await sendContactForm({ variables });
  };
  return (
    <ContactUsPageLayout
      content={(
        <ContactUsFormView
          onContactSubmission={onContactSubmission}
          saving={loading}
          saveError={error}
          saveSuccess={data}
        />
      )}
      socialLinks={(
        <SocialLinksView />
      )}
      map={(
        <MapView />
      )}
    />
  );
};
