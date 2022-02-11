import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { DisplayBold18, TextMedium16 } from '@/roanuz/typopgraphy';
import MissingImage from '@/roanuz/view/imgs/CategoryDefaultImage.png';
import { ImageView } from '@/roanuz/view/image';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { categoryLink } from './model';

export const NoCategoryImageView = ({ alt }) => {
  return (
    <ImageView
      src={MissingImage}
      alt={alt || 'Image Missing'}
    />
  );
};

NoCategoryImageView.propTypes = {
  alt: PropTypes.string,
};

const CategoryTreeLinkItemsWrapper = styled.ul`
`;

export const CategoryTreeLinkItems = ({ items }) => {
  if ((!items) || items.length === 0) {
    return null;
  }

  const className = `level-${items[0].level}`;
  const elements = items.filter((x) => x.include_in_menu === 1).map((item) => (
    <li
      key={item.uid}
      className={
        `${className} ${(item.children && item.children.length > 0) ? 'has-children' : ''}`
      }
    >
      <>
        <Link href={categoryLink(item)} prefetch={false} passHref>
          <TextMedium16 as="a" alt={`Link to ${item.name}`}>{item.name}</TextMedium16>
        </Link>
        {item.children && (
          <CategoryTreeLinkItems items={item.children} />
        )}
      </>
    </li>
  ));

  return (
    <CategoryTreeLinkItemsWrapper>
      {elements}
    </CategoryTreeLinkItemsWrapper>
  );
};

CategoryTreeLinkItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const CategoryTreeViewWrapper = styled.div`
  --tree-item-width: auto;
  --tree-item-image-height: ${asRem(180)};

  background-color: var(--color-text-rev);
  border-radius: var(--color-card-radius);
  padding: ${asRem(10)} 0;
  .level-parent {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    >li {
      margin: 0 0 ${asRem(45)} 0;
      display: block;

      .image-container {
        width: var(--tree-item-width);
        max-width: var(--tree-item-width);
        margin-bottom: ${asRem(18)};

        img {
          max-width: 100%;
          max-height: var(--tree-item-image-height);
          display: block;
          margin: auto;
        }
      }

    }

    li {
      text-align: center;
      padding-top: ${asRem(10)};
      max-width: var(--tree-item-width);

      a {
        display: block;
      }
    }
  }


  @media screen and (min-width: ${Breakpoint.sm}) {
    --tree-item-width: ${asRem(220)};
    .level-parent {
      flex-direction: row;
      align-items: inherit;
      >li {
        margin-right: ${asRem(45)};

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

`;

export const CategoryTreeView = ({
  tree,
  showImages,
}) => {
  let shouldShowImage = false;
  if (showImages) {
    // Ensure atleast one category have a image
    for (let i = 0; i < tree.length; i += 1) {
      if (tree[i].image) {
        shouldShowImage = true;
        break;
      }
    }
  }

  return (
    <CategoryTreeViewWrapper>
      <ul className="level-parent">
        {tree.map((item) => (
          <li
            key={item.uid}
          >
            <Link href={categoryLink(item)} prefetch={false}>
              <a alt={`Link to ${item.name}`}>
                {shouldShowImage && (
                  <div className="image-container">
                    {item.image
                      ? (
                        <ImageView
                          src={item.image}
                          alt={`Image of ${item.name}`}
                        />
                      ) : <NoCategoryImageView />}
                  </div>
                )}
                <DisplayBold18 as="span">{item.name}</DisplayBold18>
              </a>
            </Link>
            {/* UX team requested to hide the third level category in root category home page */}
            {/* {item.children && item.children.length > 0 && (
              <CategoryTreeLinkItems items={item.children} />
            )} */}
          </li>
        ))}
      </ul>
    </CategoryTreeViewWrapper>
  );
};

CategoryTreeView.propTypes = {
  tree: PropTypes.arrayOf(PropTypes.object),
  showImages: PropTypes.bool,
};
