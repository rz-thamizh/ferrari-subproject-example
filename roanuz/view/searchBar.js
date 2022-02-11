import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  InstantSearch, SearchBox, Hits,
  Highlight,
  connectHighlight,
  Index,
  Configure,
} from 'react-instantsearch-dom';
import Link from 'next/link';
import styled, { css } from 'styled-components';
import algoliasearch from 'algoliasearch/lite';
import Config from '@/config';

import { StoreConfigContext } from '@/store/core/context';
import 'instantsearch.css/themes/satellite.css';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { ImageView } from './image';
import { formatCurrency } from '../lib/cart';
import { productImageForSuggestion } from './product/model';
import { Text12 } from '../typopgraphy';

function extractProductLink(hit) {
  // Need a better way. Right way is building using url_path
  const { url } = hit;
  let relativeUrl = url.split('//')[1].split('/').slice(1).join('/');
  if (relativeUrl.startsWith(`${Config.StoreViewCode}/`)) {
    relativeUrl = relativeUrl.split('/').slice(1).join('/');
  }
  if (relativeUrl.includes('product/view/id')) {
    let rebuiltRelativeUrl = relativeUrl.split('s/');
    rebuiltRelativeUrl = rebuiltRelativeUrl[1].replace('/', '');
    return `/${rebuiltRelativeUrl}.html`;
  }
  return `/${relativeUrl}`;
}

function extractCategoryLink(hit) {
  // Need a better way. Right way is building using url_path
  const { url } = hit;
  let relativeUrl = url.split('//')[1].split('/').slice(1).join('/');
  if (Config.StoreViewCode) {
    if (relativeUrl.startsWith(`${Config.StoreViewCode}/`)) {
      relativeUrl = relativeUrl.split('/').slice(1).join('/');
    } else {
      return null;
    }
  }
  return `/${relativeUrl}`;
}

const CustomHighlight = connectHighlight(({ highlight, attribute, hit }) => {
  const parsedHit = highlight({
    highlightProperty: '_highlightResult',
    attribute,
    hit,
  });

  return (
    <div>
      {parsedHit.map(
        (part) => (
          part.isHighlighted ? <strong>{part.value}</strong> : part.value
        ),
      )}
    </div>
  );
});

const ProductResultItemWrapper = styled.div`
  display: flex;
  margin-right: ${asRem(20)};
  margin-bottom: ${asRem(20)};

  >.left {
    width: ${asRem(80)};
    .rz-image-view {
      height: ${asRem(80)};
      width: 100%;
      padding: ${asRem(5)} 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    img {
      max-height: 100%;
      max-width: 100%;
    }
  }
  >.right {
    width: ${asRem(180)};
    padding-left: ${asRem(10)};

    .ais-sku {
      color: var(--color-disabled);
      font-size: ${asRem(12)};
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;  
      overflow: hidden;
      margin-top: ${asRem(4)};
    }

    .ais-Highlight {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;  
      overflow: hidden;
    }

    .price-text {
      padding-top: ${asRem(4)};
      color: var(--color-button);
    }
  }

  mark {
    color: inherit;
    font-weight: bold;
    background-color: inherit;
  }
`;

const ProductResultItem = ({ hit }) => {
  if (Config.RestrictProductByWebsite && !Config.FilterAlgoliaBasedOnWebsite) {
    if (!hit.rz_visible_websites || !hit.rz_visible_websites.length) {
      return null;
    }
    if (typeof hit.rz_visible_websites === 'string') {
      if (hit.rz_visible_websites !== Config.WebsiteKey.toUpperCase()) {
        return null;
      }
    } else if (!hit.rz_visible_websites.includes(Config.WebsiteKey.toUpperCase())) {
      return null;
    }
  }
  return (
    <ProductResultItemWrapper>
      <div className="left">
        <ImageView
          src={productImageForSuggestion(hit)}
          alt={`Image of ${hit.name}`}
          showDefaultPlaceholder
          skipMediaUrlFix={!hit.rz_gallery_meta}
        />
      </div>
      <div className="right">
        <Link href={extractProductLink(hit)} prefetch={false}>
          <a alt={`Link to ${hit.name}`}>
            <Highlight attribute="name" hit={hit} tagName="mark" />
          </a>
        </Link>
        <Text12 className="ais-sku">{hit.sku}</Text12>
        <div className="price-text">
          {/* Need a better way to find currency */}
          {formatCurrency(hit.price.ISK.default, 'ISK')}
        </div>
      </div>
    </ProductResultItemWrapper>
  );
};

ProductResultItem.propTypes = {
  hit: PropTypes.object,
};

const CategoryResultItemWrapper = styled.div`
  margin-right: ${asRem(10)};
  margin-bottom: ${asRem(10)};
  mark {
    color: inherit;
    font-weight: bold;
    background-color: inherit;
  }
`;

const CategoryResultItem = ({ hit }) => {
  const data = useContext(StoreConfigContext);
  const url = extractCategoryLink(hit);
  if (!url) { return null; }
  if (!data.categoryTreeData.listOfAllChildCategories.includes(parseInt(hit.objectID, 10))) {
    return null;
  }
  return (
    <CategoryResultItemWrapper>
      <Link href={extractCategoryLink(hit)} prefetch={false}>
        <a alt={`Link to ${hit.name}`}>
          <Highlight attribute="name" hit={hit} tagName="mark" />
        </a>
      </Link>
    </CategoryResultItemWrapper>
  );
};

CategoryResultItem.propTypes = {
  hit: PropTypes.object,
};

const SearchBarViewWrapper = styled.div`
  position: relative;
  transition: all 0.5s ease-out;

  .ais-SearchBox-input, .ais-SearchBox-form {
    background-color: inherit;
    box-shadow: none;
  }
  .ais-SearchBox-input {
    background-color: #fff;
    border-radius: ${asRem(30)};
    transition: all 0.5s ease-out;
  }

  ${(p) => p.showResult && css`
    .ais-SearchBox-input {
      border-radius: ${asRem(5)};
    }
  `}

  .result-container {
    position: absolute;
    z-index: 101;
    background: #fff;
    padding: ${asRem(20)};
    max-height: ${asRem(350)};
    right: 0;
    overflow: scroll;

    display: flex;
    font-size: ${asRem(14)};
    line-height: ${asRem(20)};
    font-weight: 500;
    border-radius: ${asRem(10)};
    border-top-right-radius: 0;
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08);

    .ais-Hits-list {
      padding: 0;
      margin: 0;

      .ais-Hits-item {
        padding: 0;
        margin: 0;
        box-shadow: none;
      }
    }

    h4 {
      padding-bottom: ${asRem(10)};
      color: var(--color-disabled);
    }

    a {
      color: var(--color-text);
    }

    .product-container {
      padding-top: ${asRem(20)};
      .ais-Hits-list {
        .ais-Hits-item{
          font-size: ${asRem(14)};
          line-height: ${asRem(20)};
          font-weight: 500;
        }
      }
    }

    .category-container {
      .ais-Hits-list {
        .ais-Hits-item{
          font-size: ${asRem(16)};
          line-height: ${asRem(21)};
          font-weight: 500;
        }
      }
    }
  }

  @media screen and (max-width: 767px) {
    .result-container {
      flex-flow: column-reverse;
      width: 100%;
    }
  }

  @media screen and (min-width: ${Breakpoint.sm}) {
    .result-container {
      .product-container {
        padding-top: ${asRem(20)};
        padding-left: ${asRem(20)};
        .ais-Hits-list {
          display: flex;
          flex-wrap: wrap;
        }
      }

      .category-container {
        margin-top: ${asRem(20)};
        margin-left: ${asRem(20)};
        border-right: 1px solid var(--color-disabled-3);
      }
    }
    .ais-SearchBox {
      max-width: ${asRem(180)};
    }
  }

  @media screen and (min-width: ${Breakpoint.md}) {
    .ais-SearchBox {
      width: ${asRem(360)};
      max-width: 100%;
    }
    .result-container {
      .product-container {
        .ais-Hits-list {
          width: ${asRem(580)};
        }
      }
      .category-container .ais-Hits-list {
        width: ${asRem(200)};
      }
    }
  }

  @media screen and (min-width: ${Breakpoint.lg}) {
    .ais-SearchBox {
      width: ${asRem(480)};
    }
    .result-container {
      min-width: ${asRem(950)};
      .product-container {
        .ais-Hits-list {
          width: ${asRem(580)};
        }
      }
      .category-container .ais-Hits-list {
        width: ${asRem(300)};
      }
    }
  }
`;

export const SearchBarView = ({
  productIndexName,
  categoryIndexName,
  searchText,
  onSubmit,
}) => {
  const searchClient = algoliasearch(Config.AlgoliaAppKey, Config.AlgoliaSearchKey);
  const [showResult, setShowResult] = useState(false);

  const [prefetchResults, setPrefetchResults] = useState(Config.AlgoliaPrefetchSearch);

  const hideResult = (e) => {
    setTimeout(() => {
      // Short break to ensure click happend before hide
      setShowResult(false);
      if (!e.target.value) {
        setPrefetchResults(0);
      }
    }, 300);
  };

  const prepareSearchClient = {
    search(requests) {
      if (prefetchResults === 0) {
        return null;
      }
      // Based on config value decide if we should prefetch and show result for empty input or not
      if (Config.AlgoliaPrefetchSearch === 0 && requests.every(({ params }) => !params.query)) {
        return null;
      }
      // Removing the filters param for categories alone.
      const index = requests.findIndex((item) => {
        return item.indexName === categoryIndexName;
      });
      if (index && requests[index].params.filters) {
        // eslint-disable-next-line no-param-reassign
        delete requests[index].params.filters;
      }
      return searchClient.search(requests);
    },
  };

  const prepareResults = () => {
    if (prefetchResults === 0) {
      setPrefetchResults(1);
    } else {
      setShowResult(true);
    }
    if (Config.AlgoliaPrefetchSearch === 1) {
      setShowResult(true);
    }
  };

  const onSubmitEvent = (event) => {
    event.preventDefault();
    setShowResult(false);
    if (onSubmit) {
      onSubmit(event.currentTarget[0].value);
    }
    return true;
  };

  const showResultContainer = (e) => {
    if (e.target.value) {
      setShowResult(true);
    } else if (!Config.AlgoliaPrefetchSearch) {
      setShowResult(false);
    } else {
      setShowResult(true);
    }
  };

  return (
    <SearchBarViewWrapper showResult={showResult}>
      <InstantSearch
        searchClient={prepareSearchClient}
        indexName={productIndexName}
      >
        {Config.RestrictProductByWebsite
        && Config.FilterAlgoliaBasedOnWebsite && (
          <Configure filters={`rz_visible_websites:${Config.WebsiteKey.toUpperCase()}`} />
        )}
        <SearchBox
          defaultRefinement={searchText}
          translations={{
            placeholder: 'Leita eftir…',
          }}
          onFocus={() => prepareResults()}
          onBlur={hideResult}
          onChange={() => [setPrefetchResults(1), setShowResult(true)]}
          onSubmit={onSubmitEvent}
          onClick={showResultContainer}
        />
        {showResult && (
          <div className="result-container">
            <div className="category-container">
              <h4>Vöruflokkar</h4>
              <Index indexName={categoryIndexName}>
                <Hits hitComponent={CategoryResultItem} />
              </Index>
            </div>
            <div className="product-container">
              <h4>Leitarniðurstöður</h4>
              <Index indexName={productIndexName}>
                <Hits hitComponent={ProductResultItem} />
              </Index>
            </div>
          </div>
        )}
      </InstantSearch>
    </SearchBarViewWrapper>
  );
};

SearchBarView.propTypes = {
  productIndexName: PropTypes.string.isRequired,
  categoryIndexName: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  searchText: PropTypes.string,
};
