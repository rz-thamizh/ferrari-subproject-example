import React, { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { StoreConfigContext } from '@/store/core/context';
import { HomePageBannersQuery } from '@/store/cms/query';
import { ErrorView, LoadingView } from '@/roanuz/view/status';
import { GalleryView } from '@/roanuz/view/cms/galleryView';
import { selectHomePageGallery } from '@/roanuz/view/cms/gallery';

export const HomePageBannerController = () => {
  const storeConfig = useContext(StoreConfigContext);
  const { websiteId } = storeConfig.websiteConfig;
  const { loading, error, data } = useQuery(HomePageBannersQuery, {
    variables: { websiteId },
  });

  if (error) {
    return (
      <ErrorView error={error} />
    );
  }

  if (loading) {
    return (
      <LoadingView />
    );
  }

  const gallery = selectHomePageGallery(data);
  if (!gallery) {
    return null;
  }

  return (
    <GalleryView
      gallery={gallery}
      padded
    />
  );
};

HomePageBannerController.propTypes = {
};
