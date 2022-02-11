import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContainerWidgets from '@/components/layout/ContainerWidgets';
import { LayoutContainer } from '@/store/layout/layout';
import { filterPageWidgets } from '@/store/layout/widget';
import { BreadcrumbView, buildBrandBreadcrumbLinks } from '@/roanuz/view/breadcrumb';

import { BrandPageLayout } from '@/roanuz/layout/brand/page';
import { ImageView } from '@/roanuz/view/image';
import { asRem } from '@/roanuz/lib/css';
import { BrandCategoriesView } from './categories';

const BrandPageViewWrapper = styled.div`
.brand-banner-image {
  margin-bottom: ${asRem(30)};
  >.rz-image-view {
    width: 100%;
    max-width: ${asRem(200)};
    img {
      max-width: 100%;
      max-height: ${asRem(150)};
    }
  }
}

.brand-categories-featured {
  >div {
    margin-bottom: ${asRem(60)};
  }
}
`;

export const BrandPageView = ({
  brandMeta,
  brandCategories,
  widgets,
  // eslint-disable-next-line no-unused-vars
  featuredCategories,
}) => {
  const breadcrumbLinks = buildBrandBreadcrumbLinks({ brandMeta });
  const pageWidgets = filterPageWidgets({ widgets });

  return (
    <BrandPageViewWrapper>
      <BrandPageLayout
        breadcrumb={(
          <BreadcrumbView links={breadcrumbLinks} />
        )}
        // title={(
        //   <DisplayBold30 as="h1">{brandMeta.name}</DisplayBold30>
        // )}
        topContent={(
          <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentTop} />
        )}
        bottomContent={(
          <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentBottom} />
        )}
      >
        <div className="brand-page-top-container">
          <div className="brand-banner-image">
            <ImageView
              src={brandMeta.imageUrl}
              alt={`Brand ${brandMeta.name} Image`}
            />
          </div>
          {brandCategories.length > 1 && (
            <div className="brand-categories-section">
              <BrandCategoriesView
                filledStyle
                brandUrlKey={brandMeta.key}
                categories={brandCategories}
              />
            </div>
          )}
        </div>
        {featuredCategories.length > 0 && (
          <div className="brand-categories-featured">
            {featuredCategories.map((ele) => ele)}
          </div>
        )}
      </BrandPageLayout>
    </BrandPageViewWrapper>
  );
};

BrandPageView.propTypes = {
  brandMeta: PropTypes.object.isRequired,
  widgets: PropTypes.arrayOf(PropTypes.object),
  brandCategories: PropTypes.arrayOf(PropTypes.object),
  featuredCategories: PropTypes.arrayOf(PropTypes.element),
};
