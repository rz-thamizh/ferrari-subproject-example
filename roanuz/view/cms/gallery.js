export function selectHomePageGallery(response) {
  const galleries = response.allHomePageBanners;
  if (galleries.length === 0) {
    return null;
  }
  if (galleries.length === 1) {
    return galleries[0];
  }

  const onlineGalleries = galleries.filter((gallery) => {
    let good = true;
    const now = new Date();

    if (good && gallery.online && now < new Date(gallery.online)) {
      good = false;
    }

    if (good && gallery.offline && now > new Date(gallery.offline)) {
      good = false;
    }

    if (good && (!gallery.online) && (!gallery.offline)) {
      good = false;
    }

    return good;
  });

  if (onlineGalleries.length > 0) {
    return onlineGalleries[0];
  }

  const defaultGalleries = galleries.filter((gallery) => gallery.useAsFallback);

  if (defaultGalleries.length > 0) {
    return defaultGalleries[0];
  }

  return null;
}
