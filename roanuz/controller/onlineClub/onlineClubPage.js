import React, { useState } from 'react';
import { OnlineClubPageLayout } from '@/roanuz/layout/onlineClub/onlineClubPage';
import { OnlineClubFormView } from '@/roanuz/view/onlineClub/onlineClubForm';
import { TopContent } from '@/roanuz/view/onlineClub/topContent';
import { ImageView } from '@/roanuz/view/image';
import { StoreSpecificContent } from '@/store/core/storeUtils';
import { useMutation } from '@apollo/client';
import { subscribeEmailToNewsletterMutation } from '@/store/customer/query';

export const OnlineClubPageController = () => {
  const [popup, setPopup] = useState(false);

  const [subscribeNewsletter, { error }] = useMutation(subscribeEmailToNewsletterMutation, {
    onCompleted: (updatedData) => {
      // Ensure customer newletter is updated
      console.log(error);
      if (updatedData && updatedData.subscribeEmailToNewsletter) {
        console.log('✅ Newsletter subscribed', updatedData.subscribeEmailToNewsletter, error);
        setPopup(true);
      }
    },
  });

  const onPopupClose = () => {
    setPopup(false);
  };

  const onSave = async (variables) => {
    await subscribeNewsletter({ variables });
  };

  const { newsletterPageImg } = StoreSpecificContent;

  return (
    <OnlineClubPageLayout
      topContent={(
        <TopContent />
      )}
      form={(
        <OnlineClubFormView
          onSave={onSave}
          saveError={error}
          onPopupClose={onPopupClose}
          popup={popup}
        />
      )}
      image={(
        <ImageView src={newsletterPageImg} alt="Store image" />
      )}
    />
  );
};
