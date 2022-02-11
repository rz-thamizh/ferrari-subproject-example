import { gql } from '@apollo/client';

export const ResponsiveImageFragment = gql`
fragment ResponsiveImageFragment on ResponsiveImage {
  srcSet
  webpSrcSet
  sizes
  src
  width
  height
  aspectRatio
  alt
  title
  base64
}
`;

export const UrlResolverQuery = gql`
query urlResolver($url: String!){
  urlResolver(url: $url) {
    canonical_url
    entity_uid
    id
    redirectCode
    relative_url
    type
  } 
}
`;

export const CmsPageQuery = gql`
query cmsPage($identifier: String!){
  cmsPage(identifier: $identifier) {
    content
    content_heading
    identifier
    meta_description
    meta_keywords
    meta_title
    page_layout
    title
    url_key
  } 
}
`;

export const cmsBlocksQuery = gql`
query cmsBlocks($identifiers: [String!]){
  cmsBlocks(identifiers: $identifiers) {
    items {
      content
      identifier
      title
    }
  } 
}
`;

export const GalleryImageRecordFragment = gql`
${ResponsiveImageFragment}
fragment GalleryImageRecordFragment on GalleryImageRecord {
  id
  cssClass
  link
  image {
    responsiveImage(imgixParams: {fit: fill, w: "1280"}) {
      ...ResponsiveImageFragment
    }
  }
  imageTablet {
    responsiveImage(imgixParams: {fit: fill, w: "1280"}) {
      ...ResponsiveImageFragment
    }
  }
  imageMobile {
    responsiveImage(imgixParams: {fit: fill, w: "670"}) {
      ...ResponsiveImageFragment
    }
  }
}
`;

export const HomePageBannersQuery = gql`
${GalleryImageRecordFragment}
query HomePageBannersQuery($websiteId: ItemId!) {
  allHomePageBanners(first: 100, filter: {website: {eq: $websiteId}, enable: {eq: true}}) {
    online
    offline
    useAsFallback
    images {
      ...GalleryImageRecordFragment
    }
  }
}
`;
