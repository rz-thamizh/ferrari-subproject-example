import React from 'react';
import { ImageListView } from './imageListView';

export default {
  title: 'TL / View / Image Widget',
  component: ImageListView,
};

const jsonData = {
  column_count: 6,
  mobile_column_count: 2,
  slides: [
    {
      image_url: 'https://tl-dev-backend.roanuz.com/pub/media/Group_55-1.png',
      title: 'Skjátölvur',
      link: '#',
    },
    {
      image_url: 'https://tl-dev-backend.roanuz.com/pub/media/Group_55-2.png',
      title: 'Prentarar',
      link: '',
    },
    {
      image_url: 'https://tl-dev-backend.roanuz.com/pub/media/Group_55-3.png',
      title: 'Routers',
      link: '',
    },
    {
      image_url: 'https://tl-dev-backend.roanuz.com/pub/media/Group_55-4.png',
      title: 'Heyrnatól og Hátalarar',
      link: '',
    },
    {
      image_url: 'https://tl-dev-backend.roanuz.com/pub/media/Group_55-5.png',
      title: 'Chromebooks',
      link: '',
    },
    {
      image_url: 'https://tl-dev-backend.roanuz.com/pub/media/Group_55.png',
      title: 'Spjaldtölvur',
      link: '',
    },
  ],
};

const ImagesTemplate = () => (
  <ImageListView
    desktopSlides={jsonData.column_count}
    mobileSlides={jsonData.mobile_column_count}
    slides={jsonData.slides}
  />
);

export const ImageCarousel = ImagesTemplate.bind({});

const twoColumnJsonData = {
  column_count: 2,
  mobile_column_count: 2,
  slides: [
    {
      image_url: 'https://tl-dev-backend.roanuz.com/pub/media/Group_45.png',
      title: '',
      link: 'http://localhost:3000/women/bottoms/pants.html',
    },
    {
      image_url: 'https://tl-dev-backend.roanuz.com/pub/media/Group_45.png',
      title: '',
      link: '',
    },
  ],
};

const ImageGridTemplate = () => (
  <ImageListView
    columnCount={twoColumnJsonData.column_count}
    mobileColumnCount={twoColumnJsonData.mobile_column_count}
    slides={twoColumnJsonData.slides}
  />
);

export const ImageGrid = ImageGridTemplate.bind({});
