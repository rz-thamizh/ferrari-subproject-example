import React from 'react';
import Config from '@/config';
import { Page } from '@/components/view/Page';

export const HomePage = () => {
  // console.log('🧜‍♀️ 🧜‍♀️  Render Home Page');
  return (
    <Page
      reqPath="/"
    />
  );
};

export async function getStaticProps() {
  return { props: {}, revalidate: Config.HomePageCacheSeconds };
}

HomePage.propTypes = {
};
export default HomePage;
