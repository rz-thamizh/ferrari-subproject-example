import React from 'react';
import Config from '@/config';
import { useRouter } from 'next/router';
import { Page } from '@/components/view/Page';

export const DynamicPage = () => {
  const router = useRouter();
  let path = router.asPath;
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  // 1. Bug in next.js server sider. Returns additional
  //    query parameters.
  // 2. May be query params not required for magento
  //    urlResolver.
  [path] = path.split('?');

  // console.log('Render Dynamic Page', path);
  return (
    <Page
      reqPath={path}
    />
  );
};

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps() {
  // console.log('Dynamic Page Props', Config.PageCacheSeconds);
  return { props: {}, revalidate: Config.PageCacheSeconds };
}

DynamicPage.propTypes = {
};

export default DynamicPage;
