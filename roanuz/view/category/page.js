import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ContainerWidgets from '@/components/layout/ContainerWidgets';
import { LayoutContainer } from '@/store/layout/layout';
import { filterCategoryWidgets } from '@/store/layout/widget';
import { BreadcrumbView, buildBrandBreadcrumbLinks, buildCategoryBreadcrumbLinks } from '@/roanuz/view/breadcrumb';
import { DisplayBold30 } from '@/roanuz/typopgraphy';
import { CategoryPageLayout } from '@/roanuz/layout/category/page';
import { ImageView } from '@/roanuz/view/image';
import { BlockView } from '@/components/layout/Block';
import MagentoHtml from '@/components/layout/MagentoHtml';
import { CategoryAutoContentView } from './autoContent';
// import { CategoryProductsWithFilterView } from './productsWithFilter';
import { CategoryProductsWithFilterViewV2 } from './filterv2/productsWithFilter';

const CategoryPageViewWrapper = styled.div`
.category-banner-image {
  >.rz-image-view {
    max-width: 100%;
    img {
      max-width: 100%;
    }
  }
}
`;

export const CategoryPageView = ({
  category,
  widgets,
  filterResult,
  filterLoading,
  filterError,
  filterInput,
  sortInput,
  onFilterUpdate,
  onSortUpdate,
  onPageChange,
  categoryTree,
  featuredCategories,
  brandMeta,
  forceFilterView,
  titleText,
  categoryImmediateChildren,
  initialAggregations,
  aggregationsItemCounts,
  initPageFilters,
  activeFilter,
  isSearchResultPage,
}) => {
  const breadcrumbLinks = (brandMeta)
    ? buildBrandBreadcrumbLinks({ brandMeta, category })
    : buildCategoryBreadcrumbLinks({ category });

  // Todo: Search page widgets missing. May be this comp shoudl recive filtered widgets
  const pageWidgets = category ? filterCategoryWidgets({ widgets, category }) : [];

  const breadcrumb = (
    <BreadcrumbView links={breadcrumbLinks} />
  );

  let titleStr = titleText || 'Products';
  if (category) {
    titleStr = category.name;
  }

  const title = (
    <DisplayBold30 as="h1">{titleStr}</DisplayBold30>
  );

  const topWidgets = (
    <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentTop} />
  );
  let topContent = null;

  const bottomWidgets = (
    <ContainerWidgets widgets={pageWidgets} container={LayoutContainer.ContentBottom} />
  );
  let bottomContent = bottomWidgets;

  let cmsContent = null;
  if ((!forceFilterView) && category && category.showStaticContent) {
    cmsContent = (
      <>
        {category.description && (
          <MagentoHtml html={category.description} />
        )}
        {category.cms_block && category.cms_block.content && (
          <BlockView content={category.cms_block} />
        )}
      </>
    );
  }

  let imageView = null;
  if (
    (!forceFilterView)
    && category
    && category.image
    // Cateogry level 3 images is used in Root catgory page
    && category.level !== 3
  ) {
    imageView = (
      <div className="category-banner-image">
        <ImageView
          src={category.image}
          alt="Banner Image"
        />
      </div>
    );
  }

  let mainContent = null;
  if ((!forceFilterView) && category && category.showAutoContent) {
    mainContent = (
      <CategoryAutoContentView
        contentTopWidgets={topWidgets}
        contentBottomWidgets={bottomWidgets}
        imageView={imageView}
        cmsContentView={cmsContent}
        categoryTree={categoryTree}
        featuredCategories={featuredCategories}
      />
    );

    topContent = null;
    bottomContent = null;
  } else if ((!forceFilterView) && category && !category.showProducts) {
    mainContent = cmsContent;
  } else {
    mainContent = (
      <CategoryProductsWithFilterViewV2
        contentTopWidgets={topWidgets}
        contentBottomWidgets={null}
        imageView={imageView}
        cmsContentView={cmsContent}
        category={category}
        filterResult={filterResult}
        filterLoading={filterLoading}
        filterError={filterError}
        filterInput={filterInput}
        sortInput={sortInput}
        onFilterUpdate={onFilterUpdate}
        onSortUpdate={onSortUpdate}
        onPageChange={onPageChange}
        forceFilterView={forceFilterView}
        categoryImmediateChildren={categoryImmediateChildren}
        initialAggregations={initialAggregations}
        aggregationsItemCounts={aggregationsItemCounts}
        initPageFilters={initPageFilters}
        activeFilter={activeFilter}
        isSearchResultPage={isSearchResultPage}
      />
    );

    topContent = null;
  }

  return (
    <CategoryPageViewWrapper>
      <CategoryPageLayout
        breadcrumb={breadcrumb}
        title={title}
        topContent={topContent}
        content={mainContent}
        bottomContent={bottomContent}
      />
    </CategoryPageViewWrapper>
  );
};

CategoryPageView.propTypes = {
  category: PropTypes.object.isRequired,
  widgets: PropTypes.element,
  filterResult: PropTypes.object,
  filterLoading: PropTypes.bool,
  filterError: PropTypes.object,
  filterInput: PropTypes.object,
  sortInput: PropTypes.object,
  onFilterUpdate: PropTypes.func,
  onSortUpdate: PropTypes.func,
  onPageChange: PropTypes.func,
  categoryTree: PropTypes.arrayOf(PropTypes.object),
  featuredCategories: PropTypes.arrayOf(PropTypes.element),
  brandMeta: PropTypes.object,
  forceFilterView: PropTypes.bool,
  titleText: PropTypes.string,
  categoryImmediateChildren: PropTypes.array,
  initialAggregations: PropTypes.object,
  aggregationsItemCounts: PropTypes.object,
  initPageFilters: PropTypes.object,
  activeFilter: PropTypes.bool,
  isSearchResultPage: PropTypes.bool,
};
