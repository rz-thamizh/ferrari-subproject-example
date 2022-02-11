import React from 'react';
import PropTypes from 'prop-types';
import { ImageListView } from '@/roanuz/view/catalog/imageListView';
import { TwoColumnSectionView } from '@/roanuz/view/twoColumnSection';

export const MagentoWidgetId = {
  ImageSlider: 'image-slider',
  TwoColumnSection: 'twocolsection',
};

export const MagentoWidgetView = ({ name, data }) => {
  if (name === MagentoWidgetId.ImageSlider) {
    return (
      <ImageListView
        className={data.class_name}
        desktopSlides={parseInt(data.column_count || '0', 10)}
        tabletSlides={parseInt(data.tablet_column_count || '0', 10)}
        mobileSlides={parseInt(data.mobile_column_count || '0', 10)}
        slides={data.slides}
        padded
      />
    );
  }
  if (name === MagentoWidgetId.TwoColumnSection) {
    return (
      <TwoColumnSectionView
        title={data.title}
        imageUrl={data.image}
        desc={data.desc}
        linkText={data.link_text}
        link={data.link}
        padded
      />
    );
  }

  console.log('Unhandled Widget', name, data);

  return null;
};

MagentoWidgetView.propTypes = {
  name: PropTypes.string.isRequired,
  data: PropTypes.object,
};
